const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/auth");
const {
  createUserRide,
  getRideById,
  finishRide,
} = require("../controllers/ridesController");

// CREATE new user ride
router.post("/request/:userId", checkAuth(["admin", "rider"]), createUserRide);

// GET ride by Id
router.get("/:id", checkAuth(["admin", "rider", "driver"]), getRideById);

// FINISH user ride
router.put("/finish/:id", checkAuth(["admin", "driver"]), finishRide);

module.exports = router;
