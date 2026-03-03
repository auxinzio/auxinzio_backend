const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const auth = require("../middlewares/authMiddleware");

router.post("/submit", contactController.submit);

router.use(auth);

router.post("/", contactController.list);
router.post("/create", contactController.create);
router.post("/update", contactController.update);
router.post("/updateStatus", contactController.updateStatus);
router.post("/show", contactController.get);
router.post("/delete", contactController.remove);

module.exports = router;
