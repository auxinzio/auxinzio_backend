const express = require("express");
const router = express.Router();
const enquiresController = require("../controllers/enquiresController");
const auth = require("../middlewares/authMiddleware");

router.post("/submit", enquiresController.submit);
router.get("/demo/:token", enquiresController.getDemo);

router.use(auth);

router.post("/", enquiresController.list);
router.post("/create", enquiresController.create);
router.post("/update", enquiresController.update);
router.post("/updateStatus", enquiresController.updateStatus);
router.post("/show", enquiresController.get);
router.post("/delete", enquiresController.remove);

module.exports = router;
