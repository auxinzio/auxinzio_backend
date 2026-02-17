const express = require("express");
const router = express.Router();
const careerController = require("../controllers/careerController");
const auth = require("../middlewares/authMiddleware");

// Public – Job listing
router.post("/jobList", careerController.jobList);
router.post("/jobShow", careerController.jobShow);

// Admin
router.use(auth);
router.post("/create", careerController.create);
router.post("/", careerController.list);
router.post("/show", careerController.get);
router.post("/update", careerController.update);
router.post("/delete", careerController.remove);

module.exports = router;
