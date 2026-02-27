const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingController");
const auth = require("../middlewares/authMiddleware");

router.post("/settingsList", settingController.settingsList);

router.use(auth);

router.post("/create", settingController.create);
router.post("/update", settingController.update);
router.post("/", settingController.list);
router.post("/show", settingController.get);
router.post("/delete", settingController.remove);
router.post("/updateStatus", settingController.updateStatus);

module.exports = router;
