const express = require("express");
const router = express.Router();
const solutionController = require("../controllers/solutionController");
const auth = require("../middlewares/authMiddleware");
const { uploadServiceImage } = require("../utils/upload");

router.post("/solutionsList", solutionController.solutionsList);
router.post("/solutionsShow", solutionController.solutionsShow);

router.use(auth);
router.post(
  "/create",
  uploadServiceImage.fields([
    { name: "main_logo", maxCount: 1 },
    { name: "sub_logo", maxCount: 1 },
  ]),
  solutionController.create,
);

router.post(
  "/update",
  uploadServiceImage.fields([
    { name: "main_logo", maxCount: 1 },
    { name: "sub_logo", maxCount: 1 },
  ]),
  solutionController.update,
);

router.post("/", solutionController.list);
router.post("/show", solutionController.get);
router.post("/delete", solutionController.remove);

module.exports = router;
