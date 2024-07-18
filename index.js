require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./src/server");

// const app = express();

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const databaseURL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

const port = process.env.PORT || 8080;
mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("We are connected to our database");
    app.listen(port, () => {
      console.log("Our Pan guerreo server is turned on");
    });
  })
  .catch((err) => {
    console.log("We have an error", err);
  });
