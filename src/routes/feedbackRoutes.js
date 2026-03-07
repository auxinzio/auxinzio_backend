const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const auth = require("../middlewares/authMiddleware");
const { uploadFeedbackImage } = require("../utils/upload");
const convertToWebp = require("../middlewares/webpConverter");

// FRONTEND
router.post("/feedbackList", feedbackController.feedbackList);
router.post(
  "/submit",
  uploadFeedbackImage.single("image"),
  convertToWebp("feedback"),
  feedbackController.submit,
);

// ADMIN
router.use(auth);

router.post("/", feedbackController.list);
router.post("/show", feedbackController.get);
router.post(
  "/create",
  uploadFeedbackImage.single("image"),
  convertToWebp("feedback"),
  feedbackController.create,
);
router.post(
  "/update",
  uploadFeedbackImage.single("image"),
  convertToWebp("feedback"),
  feedbackController.update,
);
router.post("/updateStatus", feedbackController.updateStatus);
router.post("/delete", feedbackController.remove);

module.exports = router;
