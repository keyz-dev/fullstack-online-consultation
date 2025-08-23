const User = require("../db/models/user");

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      error.status = 400;
      return next(error);
    }
    next();
  };
}

module.exports = {
  validate,
};
