const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

// Apply auth middleware to all user routes
router.use(auth);

router.post("/", userController.list);
router.post("/show", userController.get);
router.post("/create", userController.create);
router.post("/update", userController.update);
router.post("/updateStatus", userController.updateStatus);
router.post("/delete", userController.remove);

module.exports = router;
