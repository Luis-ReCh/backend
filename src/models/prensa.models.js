const mongoose = require("mongoose");

const prensaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require,
  },
  picture: {
    type: String,
    default: "",
  },
  created: {
    type: Date,
    default: new Date(Date.now() - 60 * 60 * 1000),
  },
});

module.exports = mongoose.model("Prensa", prensaSchema, "Prensa");
