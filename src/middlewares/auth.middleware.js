const jwt = require("../lib/jwt.lib");
/**
 * Middleware de auth que vamos a utilizar en las rutas privadas
 *
 * headers : {
 * Content-Type: application/json,
 * Authorization: `Bearer ${token}`
 * }
 */

const auth = (req, res, next) => {
  try {
    // Obtener mi header de autorizacion
    const authorization = req.headers.authorization || "";

    // Quitarle el Bearer y espacio a mi header
    const token = authorization.replace("Bearer ", "");

    // Verificar el token
    const isVerified = jwt.verify(token);
    // console.log("Esta Veriicado", isVerified);
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { auth };
