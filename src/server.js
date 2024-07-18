const express = require("express");
const app = express();
const cors = require("cors"); //esto es para darle acceso a la index se tiene que instalar este paquete

const routerPrensa = require("./routes/prensa.route");
const routerEstrados = require("./routes/estrado.route");

// Router
const routerUser = require("./routes/user.route");

const routerAuth = require("./routes/auth.route");

app.use(cors()); //Control de acceso para todos
app.use(express.json()); //este simpre va arriba sino no funciona

// app.use("/prensa", routerPrensa);
app.use("/", routerPrensa);
// app.use("/:id", routerPrensa);
app.use("/subida", routerPrensa);
app.use("/", routerEstrados);

//middlewares
// Middlewares de rutas
app.use("/users", routerUser);

app.use("/auth", routerAuth);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

module.exports = app;
