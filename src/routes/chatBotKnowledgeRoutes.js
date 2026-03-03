const express = require('express');
const router = express.Router();
const chatBotKnowledgeController = require('../controllers/chatBotKnowledgeController');
const auth = require("../middlewares/authMiddleware");

router.use(auth);

router.post('/create', chatBotKnowledgeController.create);
router.post('/', chatBotKnowledgeController.list);
router.post('/show', chatBotKnowledgeController.show);
router.post('/update', chatBotKnowledgeController.update);
router.post('/delete', chatBotKnowledgeController.delete);

module.exports = router;
