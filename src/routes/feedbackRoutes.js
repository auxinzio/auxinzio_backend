const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const auth = require("../middlewares/authMiddleware");
const { uploadFeedbackImage } = require("../utils/upload");

// FRONTEND
router.post("/feedbackList", feedbackController.feedbackList);
router.post(
  "/submit",
  uploadFeedbackImage.single("image"),
  feedbackController.submit,
);

// ADMIN
router.use(auth);

router.post("/", feedbackController.list);
router.post("/show", feedbackController.get);
router.post(
  "/create",
  uploadFeedbackImage.single("image"),
  feedbackController.create,
);
router.post(
  "/update",
  uploadFeedbackImage.single("image"),
  feedbackController.update,
);
router.post("/updateStatus", feedbackController.updateStatus);
router.post("/delete", feedbackController.remove);

module.exports = router;
