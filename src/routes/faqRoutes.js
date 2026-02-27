const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.post("/create", faqController.create);
router.post("/update", faqController.update);
router.post("/", faqController.list);
router.post("/delete", faqController.remove);
router.post("/updateStatus", faqController.updateStatus);

module.exports = router;
