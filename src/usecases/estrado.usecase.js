const Estrado = require("../models/estrado.models");

const listNew = () => {
  const listPrensa = Prensa.find();

  return listPrensa;
};

const list = () => {
  const listEstrado = Estrado.find();
  return listEstrado;
};

const getById = (id) => {
  const estrado = Estrado.findById(id);
  return estrado;
};

const create = async (data) => {
  const createEstrado = Estrado.create(data);

  return createEstrado;
};

//actualizar usuario
const update = (id, data) => {
  const updateEstrado = Estrado.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  });
  return updateEstrado;
};

//Eliminar Usuario
const deleted = (id) => {
  const deleteEstrado = Estrado.findByIdAndDelete(id);
  return deleteEstrado;
};

module.exports = { create, list, update, deleted, getById, listNew };
