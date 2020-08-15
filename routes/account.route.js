const express = require('express');
var router = express.Router();

var accountController = require('../controllers/account.controller');

router.get('/', (req, res) => {
    res.send('hello!')
});

router.post('/signup', accountController.postSignUp);

router.post('/signin', accountController.postSignin);

router.post('/forgot-password', accountController.forgotPassword);

router.post('/reset-password/:userId', accountController.resetPassword);

module.exports = router;