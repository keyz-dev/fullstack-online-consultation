const { User, Patient, Doctor, Pharmacy } = require("../db/models");
const {
  userLoginSchema,
  googleLoginSchema,
  emailVerificationSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../schema/userSchema");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/sendVerificationEmail");
const formatUserData = require("../utils/returnFormats/userData");
const axios = require("axios");

// ==================== UNIFIED LOGIN ====================
exports.login = async (req, res, next) => {
  try {
    const { error } = userLoginSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      include: [
        { model: Patient, as: "patient" },
        { model: Doctor, as: "doctor" },
        { model: Pharmacy, as: "pharmacy" },
      ],
    });

    if (!user) return next(new UnauthorizedError("Invalid email or password"));

    if (user.authProvider === "google" && !user.password) {
      throw new UnauthorizedError("Please continue with Google Sign In");
    }

    const match = await user.comparePassword(password);
    if (!match) return next(new UnauthorizedError("Invalid email or password"));

    if (!user.isActive)
      return next(new ForbiddenError("Your account is not active"));

    if (!user.emailVerified) {
      // Resend verification email
      try {
        await sendVerificationEmail(user, email, user.name);
      } catch (err) {
        return next(new BadRequestError("Failed to send verification email"));
      }

      return res.status(209).json({
        status: "success",
        message:
          "Please verify your email before logging in. Verification email sent.",
        data: {
          user: {
            id: user.id,
            email: user.email,
          },
        },
      });
    }

    // Generate token
    const authToken = user.generateAuthToken();

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        user: formatUserData(user),
        token: authToken,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// ==================== GOOGLE LOGIN (SIGN IN ONLY) ====================
exports.googleLogin = async (req, res, next) => {
  try {
    const { error } = googleLoginSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { access_token } = req.body;

    if (!access_token)
      return next(new BadRequestError("Access token not found"));

    // Validate token & get user profile from Google
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const { email, name, picture } = response.data;

    if (!email)
      return next(new BadRequestError("Email not available from Google"));

    let user = await User.findOne({
      where: { email },
      include: [
        { model: Patient, as: "patient" },
        { model: Doctor, as: "doctor" },
        { model: Pharmacy, as: "pharmacy" },
      ],
    });

    if (!user) {
      return next(
        new NotFoundError(
          "No account found with this email. Please register first."
        )
      );
    }

    if (!user.isActive)
      return next(new ForbiddenError("Your account is not active"));

    // Generate token
    const authToken = user.generateAuthToken();

    res.json({
      status: "success",
      message: "Google login successful",
      data: {
        user: formatUserData(user),
        token: authToken,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// ==================== EMAIL VERIFICATION ====================
exports.verifyEmail = async (req, res, next) => {
  try {
    const { error } = emailVerificationSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { email, code } = req.body;
    const user = await User.findOne({
      where: {
        email,
        emailVerificationCode: code,
        emailVerificationExpires: { [require("sequelize").Op.gt]: new Date() },
      },
    });

    if (!user)
      return next(new BadRequestError("Invalid or expired verification code"));

    await user.update({
      emailVerified: true,
      emailVerificationCode: null,
      emailVerificationExpires: null,
    });

    const token = user.generateAuthToken();
    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
      data: {
        user: formatUserData(user),
        token,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// ==================== RESEND VERIFICATION EMAIL ====================
exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const { error } = resendVerificationSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { email } = req.body;
    const user = await User.findOne({
      where: { email, emailVerified: false },
    });

    if (!user)
      return next(new NotFoundError("User not found or already verified"));

    await sendVerificationEmail(user, email, user.name);

    res.status(200).json({
      status: "success",
      message: "Verification email sent",
    });
  } catch (err) {
    return next(err);
  }
};

// ==================== FORGOT PASSWORD ====================
exports.forgotPassword = async (req, res, next) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return next(new NotFoundError("User not found"));

    await sendPasswordResetEmail(user, email, user.name);

    res.status(200).json({
      status: "success",
      message: "Password reset email sent",
    });
  } catch (err) {
    return next(err);
  }
};

// ==================== RESET PASSWORD ====================
exports.resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return next(new BadRequestError("Passwords do not match"));
    }

    const user = req.resetUser;
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiresAt = null;
    await user.save();

    res.status(200).json({
      status: "success",
      message:
        "Password has been reset successfully. Please log in with your new password.",
    });
  } catch (err) {
    return next(err);
  }
};

// ==================== VERIFY TOKEN ====================
exports.verifyToken = async (req, res, next) => {
  const user = req.authUser;
  res.status(200).json({
    status: "success",
    message: "Token verified",
    valid: true,
    data: {
      user: formatUserData(user),
    },
  });
};
