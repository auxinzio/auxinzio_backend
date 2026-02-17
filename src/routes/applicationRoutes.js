const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const auth = require("../middlewares/authMiddleware");
const { uploadResume } = require("../utils/upload");
// FRONTEND (no auth)
router.post(
  "/apply",
  uploadResume.single("resume"),
  applicationController.submit,
);
// ADMIN
router.use(auth);
router.post("/", applicationController.list);
router.post("/show", applicationController.get);
router.post("/updateStatus", applicationController.updateStatus);
router.delete("/delete", applicationController.remove);
module.exports = router;
