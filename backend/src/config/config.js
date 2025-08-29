require("dotenv").config();

module.exports = {
  development: {
    url: process.env.DB_DEV_URL,
    dialect: "postgres",
    logging: false,
  },
  test: {
    url: process.env.DB_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    url: process.env.DB_PROD_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
