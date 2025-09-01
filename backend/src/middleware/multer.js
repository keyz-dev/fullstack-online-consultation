require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { BadRequestError } = require("../utils/errors");

const inProduction = process.env.NODE_ENV === "production";

// --- Helpers ---
// Ensure upload directories exist (only for development)
function createUploadDirs() {
  if (inProduction) return;
  const dirs = [
    "uploads",
    "uploads/avatars",
    "uploads/specialties",
    "uploads/symptoms",
    "uploads/documents",
    "uploads/documents/patients",
    "uploads/documents/doctors",
    "uploads/consultations",
    "uploads/pharmacies",
    "uploads/pharmacies/documents",
    "uploads/pharmacies/logos",
    "uploads/pharmacies/images",
  ];
  dirs.forEach((dir) => {
    const dirPath = path.join(process.cwd(), "src", dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

// Determine subdirectory based on file fieldname
function getUploadSubDir(fieldname) {
  switch (fieldname) {
    case "avatar":
      return "avatars";
    case "specialtyImage":
      return "specialties";
    case "symptomImage":
      return "symptoms";
    case "patientDocument":
      return "documents/patients";
    case "doctorDocument":
      return "documents/doctors";
    case "consultationFile":
      return "consultations";
    case "pharmacyDocument":
      return "pharmacies/documents";
    case "pharmacyLogo":
      return "pharmacies/logos";
    case "pharmacyImage":
      return "pharmacies/images";
    case "medicationImage":
      return "medications/images";
    case "medicationFile":
      return "medications/files";
    default:
      return "misc";
  }
}

// Helper for Cloudinary folder
function getCloudinaryFolder(fieldname) {
  return getUploadSubDir(fieldname) || "misc";
}

// --- Initialization ---
createUploadDirs();

// --- Multer Storage Config ---
const storage = inProduction
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const subDir = getUploadSubDir(file.fieldname);
        file.folderName = subDir;
        const uploadDir = path.join(__dirname, "../uploads", subDir);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueId}${ext}`);
      },
    });

// --- File Filter ---
const fileFilter = (req, file, cb) => {
  // Allow images for most uploads

  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|ico|avif)$/;
  // Allow documents for uploads
  const documentExtensions = /\.(pdf|doc|docx|txt|jpg|jpeg|png|webp)$/;

  if (
    ["patientDocument", "doctorDocument", "pharmacyDocument", "consultationFile", "medicationFile"].includes(
      file.fieldname
    )
  ) {
    if (!file.originalname.match(documentExtensions)) {
      return cb(
        new BadRequestError(
          "Only PDF, DOC, DOCX, TXT, and image files are allowed for documents!"
        ),
        false
      );
    }
  } else {
    if (!file.originalname.match(imageExtensions)) {
      return cb(new BadRequestError("Only image files are allowed!"), false);
    }
  }

  cb(null, true);
};

// --- Multer Instance ---
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB for documents
    files: 10, // Max 10 files
  },
});

// --- Middleware: Cloudinary Upload (production) ---
const handleCloudinaryUpload = async (req, res, next) => {
  if (!inProduction) return next();

  try {
    if (!req.file && !req.files) return next();

    // Handle single file upload (upload.single)
    if (req.file) {
      const folderName = getCloudinaryFolder(req.file.fieldname);
      req.file.folderName = folderName;

      // Determine resource type based on file mimetype
      const uploadOptions = {
        folder: folderName,
        resource_type: "auto",
      };

      const result = await uploadToCloudinary(req.file.buffer, uploadOptions);
      req.file.path = result.secure_url;
    }

    // Handle multiple files
    else if (req.files) {
      // Case 1: req.files is an array (from upload.array)
      if (Array.isArray(req.files)) {
        const uploadPromises = req.files.map((file) => {
          const folderName = getCloudinaryFolder(file.fieldname);
          file.folderName = folderName;

          // Determine resource type based on file mimetype
          const uploadOptions = {
            folder: folderName,
            resource_type: "auto",
          };

          return uploadToCloudinary(file.buffer, uploadOptions);
        });

        const results = await Promise.all(uploadPromises);

        req.files = results.map((result, index) => ({
          ...req.files[index],
          path: result.secure_url,
          public_id: result.public_id,
        }));
      }
      // Case 2: req.files is an object (from upload.fields)
      else if (typeof req.files === "object" && req.files !== null) {
        const uploadedFiles = {};
        const fieldPromises = Object.keys(req.files).map(async (fieldname) => {
          const filesInField = req.files[fieldname];

          const uploadPromises = filesInField.map((file) => {
            const folderName = getCloudinaryFolder(file.fieldname);
            file.folderName = folderName;
            const uploadOptions = {
              folder: folderName,
              resource_type: "auto",
            };
            return uploadToCloudinary(file.buffer, uploadOptions);
          });

          const results = await Promise.all(uploadPromises);

          uploadedFiles[fieldname] = results.map((result, index) => ({
            ...filesInField[index],
            path: result.secure_url,
            public_id: result.public_id,
          }));
        });

        await Promise.all(fieldPromises);
        req.files = uploadedFiles;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// --- Middleware: Format File Paths for Response ---
const formatFilePaths = (req, res, next) => {
  if (req.file) {
    if (!inProduction) {
      req.file.path = `/uploads/${req.file.folderName}/${path.basename(req.file.path)}`;
    }
  }
  if (req.files && Object.keys(req.files).length > 0 && !inProduction) {
    Object.keys(req.files).forEach((key) => {
      if (Array.isArray(req.files[key])) {
        req.files[key] = req.files[key].map((file) => {
          if (!inProduction) {
            file.path = `/uploads/${file.folderName}/${path.basename(file.path)}`;
          }
          file.path = file.path.replace(/\\/g, "/");
          return file;
        });
      } else {
        req.files[key].path =
          `/uploads/${req.files[key].folderName}/${path.basename(req.files[key].path)}`;
      }
    });
  }
  next();
};

// --- Middleware: Handle Multer Errors ---
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new BadRequestError("File size too large. Maximum size is 5MB.")
      );
    }
    return next(new BadRequestError(err.message));
  }
  next(err);
};

// --- Exports ---
module.exports = {
  upload,
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
};
