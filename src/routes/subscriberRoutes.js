const express = require("express");
const router = express.Router();
const subscriberController = require("../controllers/subscriberController");
const auth = require("../middlewares/authMiddleware");

// Public (frontend subscribe)
router.post("/create", subscriberController.create);

// Admin only
router.use(auth);
router.post("/", subscriberController.list);
router.post("/show", subscriberController.get);
router.post("/update", subscriberController.update);
router.delete("/delete", subscriberController.remove);

module.exports = router;
