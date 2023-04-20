// Model Users
const usersModel = require("../models/user");
const { encrypt } = require("../helpers/handleBcrypt");

const newUser = async (dataUser) => {
  if (
    !dataUser.name ||
    !dataUser.email ||
    !dataUser.password ||
    !dataUser.address ||
    !dataUser.phone ||
    !dataUser.role
  )
    return {
      status: 400,
      message: "Todos los campos del usuario son requeridos",
    };
  try {
    dataUser.password = await encrypt(dataUser.password);
    const newUser = await usersModel.create(dataUser);
    return {
      status: 200,
      message: "Usuario creado exitosamente!",
      data: newUser._id,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Se presento un error al crear el usuario!",
      data: error,
    };
  }
};

const allUsers = async (queryString) => {
  const { search, fields } = queryString;
  const fieldsArray = fields ? JSON.parse(fields) : [];
  try {
    const query = {};
    if (search && search !== "null" && fieldsArray.length > 0) {
      query["$or"] = [];
      fieldsArray.forEach((field) => {
        let condition = {};
        condition[field] = {
          $regex: ".*" + search + ".*",
          $options: "i",
        };
        query["$or"].push(condition);
      });
    }
    const costumers = await usersModel.find(query);
    return {
      status: 200,
      message: "Se encontraron los usuarios de manera exitosa!",
      data: costumers,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Se presento un error al buscar usuarios!",
      data: error,
    };
  }
};

const userById = async (userId) => {
  if (!userId)
    return { status: 400, message: "El ID del usuario es requerido!" };
  try {
    const user = await usersModel.findById(userId);
    return {
      status: 200,
      message: "Se encontro el usuario de manera exitosa!",
      data: user,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Se presento un error al buscar usuario!",
      data: error,
    };
  }
};

const modifyUser = async (userId, dataCustomer) => {
  if (!userId)
    return { status: 400, message: "El ID del usuario es requerido!" };
  try {
    const costumer = await usersModel.findByIdAndUpdate(userId, dataCustomer);
    return {
      status: 200,
      message: "Usuario Actualizado!",
      data: costumer,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Se presento un error al actualizar el usuario!",
      data: error,
    };
  }
};

const deleteOneUser = async (userId) => {
  if (!userId)
    return { status: 400, message: "El ID del usuario es requerido!" };
  try {
    const costumer = await usersModel.findByIdAndRemove(userId);
    return {
      status: 200,
      message: "Usuario Eliminado!",
      data: costumer,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Se presento un error al eliminar usuario!",
      data: error,
    };
  }
};

module.exports = {
  newUser,
  allUsers,
  userById,
  modifyUser,
  deleteOneUser,
};
