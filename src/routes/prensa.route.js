require("dotenv").config();
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth.middleware");
const {
  create,
  list,
  listNew,
  update,
  deleted,
  getById,
} = require("../usecases/prensa.usecase");
// const multer = require("multer");
// const fs = require("node:fs");
const jwt = require("../lib/jwt.lib");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

router.get("/", async (req, res) => {
  try {
    const listPublic = await listNew();

    res.json({
      success: true,
      data: listPublic,
    });
  } catch (err) {
    res.status(err.status || 400);
    res.json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/prensa", auth, async (req, res) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.replace("Bearer ", "");

  // Verificar el token
  const isVerified = jwt.verify(token);
  const idUser = isVerified?.id;
  try {
    const listPublic = await list(idUser);

    res.json({
      success: true,
      data: listPublic,
    });
  } catch (err) {
    res.status(err.status || 400);
    res.json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/prensa/:id", async (req, res) => {
  try {
    const user = await getById(req.params.id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/prensa", auth, async (req, res) => {
  try {
    const createPublic = await create(req.body);
    res.status(201);
    res.json({
      success: true,
      data: createPublic,
    });
  } catch (error) {}
});

router.patch("/prensa/:id", auth, async (req, res) => {
  try {
    const updatePublic = await update(req.params.id, req.body);
    res.json({
      success: true,
      data: updatePublic,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
});

const { ACCESS_KEY_AWS, ACCESS_KEY_SECRET_AWS } = process.env;
const miRegion = "us-east-2";
let s3 = new S3Client({
  region: miRegion,
  credentials: {
    accessKeyId: ACCESS_KEY_AWS,
    secretAccessKey: ACCESS_KEY_SECRET_AWS,
  },
});

router.post("/subida", (req, res) => {
  let bucket = "bucket-image";
  // let random = Math.floor(Math.random() * 999999999999999999);
  let random = Math.floor(Date.now() / 1000);
  random = random + 1;

  let carpetaInternaBucket = `images/prensa/${random}.jpg`;
  let urlImagen =
    "https://" +
    bucket +
    ".s3." +
    miRegion +
    ".amazonaws.com/" +
    carpetaInternaBucket;

  //MULTER
  const storage = multer.memoryStorage(); //multer almacena el archivo de forma temporal
  const upload = multer({ storage: storage });

  //FUNCION DE SUBIDA DE S3
  //el file viene del append de react donde se carga la imagen
  upload.single("file")(req, res, async (err) => {
    try {
      if (err) console.log("error desde upload ", err);
      else {
        //REDIMENCIONAMOS LA IMAGEN ANTES DE SUBIRLA A S3
        const redimencionBuffer = await sharp(req.file.buffer)
          .resize({
            width: 800,
            height: 500,
            fit: "contain",
            background: "#fff",
          })
          .toBuffer();

        const params = {
          Bucket: bucket,
          Key: carpetaInternaBucket,
          Body: redimencionBuffer,
          ContentType: "image/jpeg",
        };

        //SUBIMOS LA IMAGEN
        const command = new PutObjectCommand(params);
        await s3
          .send(command)
          .then((response) => {
            return res.status(200).json({
              urlImagen: urlImagen,
              mensaje: "Se subio el Archivo correctamente",
            });
          })
          .catch((error) => {
            console.log("Error al ejecutar el Send ", error);
            return res.status(400).json({
              mensaje: "Error al subir la imagen, Favor de intentar nuevamente",
            });
          });
      }
    } catch (err) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message,
      });
    }
  });

  //console.log("esto es subida ", req);
});
router.delete("/prensa/:id", async (req, res) => {
  try {
    const user = await deleted(req.params.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/eliminar", (req, res) => {
  let bucket = "bucket-image";
  // let random = Math.floor(Math.random() * 999999999999999999);

  let random = Math.floor(Date.now() / 1000);
  random = random + 1;
  console.log(random);
  let carpetaInternaBucket = `images/${random}.jpg`;

  let paramsDelete = {
    Bucket: bucket,
    Key: carpetaInternaBucket,
  };

  const commandDelete = new DeleteObjectCommand(paramsDelete);

  s3.send(commandDelete).then((response) => {
    console.log("response ", response);
    return res.status(200).json({ mensaje: "Archivo Borrado con Éxito" });
  });

  //console.log("esto es subida ", req);
});

module.exports = router;
