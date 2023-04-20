const { verifyToken } = require("./generateToken");

const checkAuth = (roles) => async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.status(409).send({ message: "Necesita token de autenticación!" });
    }
    const token = req.headers.authorization.split(" ").pop();
    const tokenData = await verifyToken(token);
    if (tokenData.role && roles.includes(tokenData.role)) {
      next();
    } else {
      res
        .status(409)
        .send({ message: "No tiene permisos para realizar esta acción!" });
    }
  } catch (error) {}
};

module.exports = {
  checkAuth,
};
