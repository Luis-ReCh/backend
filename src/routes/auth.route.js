// http://localhost:8080/auth --> ruta de autenticación
const express = require("express");
const { login } = require("../usecases/user.usecase");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const token = await login(req.body.userEmail, req.body.userPassword);
    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
