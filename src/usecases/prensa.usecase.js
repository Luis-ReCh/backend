const Prensa = require("../models/prensa.models");

const listNew = () => {
  const listPrensa = Prensa.find();

  return listPrensa;
};

const list = (idUser) => {
  const listPrensa = Prensa.find({
    userId: idUser,
  });
  // console.log("Esto eserrr", listPrensa.schema);
  // if (!filter) {
  //   return listPrensa;
  // } else {
  //   let filterPrensa = [];
  //   for (index in listPrensa) {
  //     if (listPrensa[index].userContent.includes(filter.value)) {
  //       filterPrensa.push(listPrensa[index]);
  //     }
  //   }
  //   return filterPrensa;
  // }
  return listPrensa;
};

const getById = (id) => {
  const user = Prensa.findById(id);
  return user;
};

const create = async (data) => {
  const createPrensa = Prensa.create(data);
  return createPrensa;
};

//actualizar usuario
const update = (id, data) => {
  const updatePrensa = Prensa.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  });
  return updatePrensa;
};

//Eliminar Usuario
const deleted = (id) => {
  const deletePrensa = Prensa.findByIdAndDelete(id);
  return deletePrensa;
};

module.exports = { create, list, listNew, update, deleted, getById };
