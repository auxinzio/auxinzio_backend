const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const auth = require("../middlewares/authMiddleware");

// ADMIN
router.use(auth);
router.post("/", dashboardController.dashboard);

module.exports = router;