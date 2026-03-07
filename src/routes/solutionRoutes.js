const express = require("express");
const router = express.Router();
const solutionController = require("../controllers/solutionController");
const auth = require("../middlewares/authMiddleware");
const { uploadSolutionImage } = require("../utils/upload");
const convertToWebp = require("../middlewares/webpConverter");

router.post("/solutionsList", solutionController.solutionsList);
router.post("/solutionsShow", solutionController.solutionsShow);

router.use(auth);
router.post(
  "/create",
  uploadSolutionImage.fields([
    { name: "main_logo", maxCount: 1 },
    { name: "sub_logo", maxCount: 1 },
  ]),
  convertToWebp("solution"),
  solutionController.create,
);

router.post(
  "/update",
  uploadSolutionImage.fields([
    { name: "main_logo", maxCount: 1 },
    { name: "sub_logo", maxCount: 1 },
  ]),
  convertToWebp("solution"),
  solutionController.update,
);

router.post("/", solutionController.list);
router.post("/show", solutionController.get);
router.post("/delete", solutionController.remove);
router.post("/updateStatus", solutionController.updateStatus);

module.exports = router;
