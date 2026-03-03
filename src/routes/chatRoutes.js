const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.post('/create', chatController.create);
router.post('/', chatController.list);
router.post('/show', chatController.show);
router.post('/update', chatController.update);
router.post('/updateStatus', chatController.updateStatus);
router.post('/delete', chatController.delete);

module.exports = router;
