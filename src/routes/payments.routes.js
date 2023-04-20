const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/auth");
const {
  createPaymentMethod,
  getPaymentMethodById,
  getAcceptanceToken,
} = require("../controllers/paymentsController");

// GET acceptance token
router.get(
  "/acceptance-token",
  checkAuth(["admin", "rider", "driver"]),
  getAcceptanceToken
);

// GET payment method by Id
router.get("/:id", checkAuth(["admin", "rider"]), getPaymentMethodById);

// ADD a new payment method to user
router.post("/", checkAuth(["admin", "rider"]), createPaymentMethod);


module.exports = router;
