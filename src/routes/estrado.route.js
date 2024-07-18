require("dotenv").config();
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth.middleware");
const {
  create,
  list,
  update,
  deleted,
  getById,
  listNew,
} = require("../usecases/estrado.usecase");
// const multer = require("multer");
// const fs = require("node:fs");
const multer = require("multer");
const sharp = require("sharp");

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

router.get("/estrados", async (req, res) => {
  try {
    const listPublic = await list();
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
router.get("/estrados/:id", async (req, res) => {
  try {
    const user = await getById(req.params.id);
    console.log(user);
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

router.post("/estrados", auth, async (req, res) => {
  try {
    const createPublic = await create(req.body);
    res.status(201);
    res.json({
      success: true,
      data: createPublic,
    });
  } catch (error) {}
});

router.patch("/estrados/:id", auth, async (req, res) => {
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

router.post("/estrados/subida", (req, res) => {
  let bucket = "bucket-image";
  // let random = Math.floor(Math.random() * 999999999999999999);
  let random = Math.floor(Date.now() / 1000);
  random = random + 1;

  let carpetaInternaBucket = `docs/estrados/${random}.pdf`;
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
      if (err) console.log("error dede upload ", err);
      else {
        //REDIMENCIONAMOS LA IMAGEN ANTES DE SUBIRLA A S3

        // const redimencionBuffer = await sharp(req.file.buffer);
        const file = req.file.buffer;
        // console
        //   .log("ESTOOOOO", file)
        //   .resize({
        //     width: 800,
        //     height: 500,
        //     fit: "contain",
        //     background: "#fff",
        //   })
        //   .toBuffer();

        const params = {
          Bucket: bucket,
          Key: carpetaInternaBucket,
          Body: file,
          ContentType: "application/pdf",
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
router.delete("/estrados/:id", auth, async (req, res) => {
  try {
    const deleteEstrado = await deleted(req.params.id);
    res.json({
      success: true,
      data: deleteEstrado,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
