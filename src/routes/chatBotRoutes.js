const express = require('express');
const router = express.Router();
const chatBotController = require('../controllers/chatBotController');

router.post('/initial', chatBotController.getInitialState);
router.post('/query', chatBotController.getQueryResponse);

module.exports = router;
