const express = require("express");
const router = express.Router();
const subscriberController = require("../controllers/subscriberController");
const auth = require("../middlewares/authMiddleware");

// Public (frontend subscribe)
router.post("/submit", subscriberController.submit);

// Admin only
router.use(auth);
router.post("/create", subscriberController.create);
router.post("/", subscriberController.list);
router.post("/show", subscriberController.get);
router.post("/update", subscriberController.update);
router.post("/delete", subscriberController.remove);
router.post("/updateStatus", subscriberController.updateStatus);

module.exports = router;
