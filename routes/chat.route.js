const express = require('express');
var router = express.Router();

var chatController = require('../controllers/chat.controller');
var authMiddleware = require('../middlewares/auth.middleware');

router.get('/channels', chatController.getAllChannels)

router.get('/channel/:channelId', authMiddleware.requiredLogin, chatController.getMessages)

router.post('/create-channel', authMiddleware.requiredLogin, chatController.postCreateChannel);

router.post('/add-user/:channelId', authMiddleware.requiredLogin, chatController.postAddUserToChannel);

router.post('/delete-user/:channelId', authMiddleware.requiredLogin, chatController.postDeleteUser);

router.post('/delete-channel/:channelId', authMiddleware.requiredLogin, chatController.postDeleteChannel);

module.exports = router;