const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["admin", "user", "user2", "user3", "user4"],
    required: true,
  },
  userEmail: {
    type: String,
    match: /^.*@.*\..*$/,
    require: true,
    unique: true,
  },

  userLastname: {
    type: String,
    require: false,
    trim: true, //quita los espacios por si se agrega en el formulario
  },

  userName: {
    type: String,
    require: false,
    trim: true, //quita los espacios por si se agrega en el formulario
  },
  userPassword: {
    type: String,
    require: true,
  },
  // prensa: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: "Prensa",
  // },
});

module.exports = mongoose.model("Users", userSchema, "Users");
