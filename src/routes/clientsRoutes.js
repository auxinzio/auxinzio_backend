const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clientsController");
const auth = require("../middlewares/authMiddleware");
const { uploadTeamImage } = require("../utils/upload");
const convertToWebp = require("../middlewares/webpConverter");

// Public – Job listing
router.post("/clientsList", clientsController.clientList);

// Admin
router.use(auth);
router.post(
    "/create",
    uploadTeamImage.single("image"),
    convertToWebp("clients"),
    clientsController.create,
);
router.post("/", clientsController.list);
router.post("/show", clientsController.get);
router.post(
    "/update",
    uploadTeamImage.single("image"),
    convertToWebp("clients"),
    clientsController.update,
);
router.post("/delete", clientsController.remove);
router.post("/updateStatus", clientsController.updateStatus);

module.exports = router;
