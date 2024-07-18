const bcrypt = require("bcrypt");
const jwt = require("../lib/jwt.lib");
const User = require("../models/user.models");

const createError = require("http-errors");

const create = async (data) => {
  // cadena aleatoria entre mas, mas seguro pero mas se tarda
  const saltRounds = 10;

  //Hashear la password
  const hashedPassword = await bcrypt.hash(data.userPassword, saltRounds);

  //Cambiar la password en texto plano de la data a la que esta hasheada
  data.userPassword = hashedPassword;

  const user = User.create(data);
  return user;
};
const list = (filter) => {
  const users = User.find();
  return users;
};

const login = async (email, password) => {
  // Validar que un usuario con ese correo exista
  const user = await User.findOne({ userEmail: email });
  // Falla correo
  if (!user) throw createError(400, "Invalid data");

  // Validar la password
  const isValidPassword = await bcrypt.compare(password, user.userPassword);
  if (!isValidPassword) throw createError(400, "Invalid data");

  // Si es la password y si es el correo regresamos token
  const token = jwt.sign({
    id: user._id,
    // userName: `${user.userName} ${user.userLastname}`,
    email: user.userEmail,
  });
  return token;
};

const get = async (id) => {
  const user = await User.findById(id);

  if (!user) throw createError(404, "User not found");
  return user;
};

const update = async (id, data, req) => {
  const user = await User.findById(id);
  const authorization = req.headers.authorization || "";
  const token = authorization.replace("Bearer ", "");
  const isVerified = jwt.verify(token);
  if (isVerified.id != user.id)
    throw createError(403, "No tienes permiso de editar a este usuario");
  // cadena aleatoria entre mas, mas seguro pero mas se tarda
  const saltRounds = 10;

  //Hashear la password
  const hashedPassword = await bcrypt.hash(data.userPassword, saltRounds);

  //Cambiar la password en texto plano de la data a la que esta hasheada
  data.userPassword = hashedPassword;
  const updatedUser = await User.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  });
  //   if (!updatedUser) throw createError(404, "User not found");
  return updatedUser;
};

const filteredList = async (filter) => {
  const posts = await Post.find(filter);
  return posts;
};

module.exports = { create, login, get, filteredList, update, list };
