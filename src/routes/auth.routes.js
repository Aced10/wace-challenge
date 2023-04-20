const router = require("express").Router();
const { login } = require("../controllers/authController");

// Login route
router.post("/login", login);

module.exports = router;
