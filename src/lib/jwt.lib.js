const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

// Funcion para hacer el token
const sign = (payload = {}) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "5h" });
};

// Funcion para verificar el token
const verify = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = { sign, verify };
