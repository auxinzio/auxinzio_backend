const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const auth = require("../middlewares/authMiddleware");
const { uploadServiceImage } = require("../utils/upload");

router.post("/servicesList", serviceController.servicesList);
router.post("/servicesShow", serviceController.servicesShow);

router.use(auth);
router.post(
  "/create",
  uploadServiceImage.fields([
    { name: "main_logo", maxCount: 1 },
    { name: "sub_logo", maxCount: 1 },
  ]),
  serviceController.create,
);
router.post(
  "/update",
  uploadServiceImage.fields([
    { name: "main_logo", maxCount: 1 },
    { name: "sub_logo", maxCount: 1 },
  ]),
  serviceController.update,
);
router.post("/", serviceController.list);
router.post("/show", serviceController.get);
router.delete("/delete", serviceController.remove);

module.exports = router;
