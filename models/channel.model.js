const mongoose = require('mongoose');

let channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true
    }
});

let Channel = mongoose.model('Channel', channelSchema, 'channels');

module.exports = Channel; 