const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

router.post("/login", authController.login);

router.use(auth);

router.post("/logout", authController.logout);
router.post("/profile", authController.profile);
router.post("/changePassword", authController.changePassword);

module.exports = router;
