require("dotenv").config();
module.exports = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.SERVER_NAME,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    port: Number(process.env.DB_PORT),
  },
};
