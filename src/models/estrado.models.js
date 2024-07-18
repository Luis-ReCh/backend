const mongoose = require("mongoose");

const estradoSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require,
  },
  document: {
    type: String,
    require: true,
  },
  created: {
    type: Date,
    default: new Date(Date.now() - 60 * 60 * 1000),
  },
});
module.exports = mongoose.model("Estrado", estradoSchema, "Estrado");
