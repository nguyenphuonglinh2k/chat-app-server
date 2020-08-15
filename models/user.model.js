const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    userImageUrl: {
        type: String,
        required: true
    }
});

let User = mongoose.model('User', userSchema, 'users');

module.exports = User;