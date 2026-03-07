const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");
const auth = require("../middlewares/authMiddleware");
const { uploadTeamImage } = require("../utils/upload");
const convertToWebp = require("../middlewares/webpConverter");

router.post("/teamsList", teamController.teamsList);

router.use(auth);

router.post("/create", uploadTeamImage.single("image"), convertToWebp("team"), teamController.create);
router.post("/update", uploadTeamImage.single("image"), convertToWebp("team"), teamController.update);
router.post("/updateStatus", teamController.updateStatus);
router.post("/", teamController.list);
router.post("/show", teamController.get);
router.post("/delete", teamController.remove);

module.exports = router;
