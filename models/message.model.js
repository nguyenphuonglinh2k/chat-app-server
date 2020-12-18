const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema.Types;

let messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    channelId: {
        type: ObjectId,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User"
    }
});

let Message = mongoose.model('Message', messageSchema, 'messages');

module.exports = Message; 