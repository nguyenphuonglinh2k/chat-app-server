const express = require('express');
var router = express.Router();

var chatController = require('../controllers/chat.controller');
var authMiddleware = require('../middlewares/auth.middleware');

router.get('/channels', chatController.getAllChannels)

router.get('/channel/:channelId', authMiddleware.requiredLogin, chatController.getMessages)

router.post('/create-channel', chatController.postCreateChannel);

module.exports = router;