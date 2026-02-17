const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middlewares/authMiddleware");
const { uploadProductImage } = require("../utils/upload");

router.post("/productsList", productController.productsList);
router.post("/productsShow", productController.productsShow);

router.use(auth);

router.post(
  "/create",
  uploadProductImage.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  productController.create,
);

router.post(
  "/update",
  uploadProductImage.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  productController.update,
);

router.post("/", productController.list);
router.post("/show", productController.get);
router.post("/delete", productController.remove);

module.exports = router;
