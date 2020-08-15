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
        _id: {
            type: ObjectId,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: String,
        userImageUrl: {
            type: String,
            required: true
        }
    }
});

let Message = mongoose.model('Message', messageSchema, 'messages');

module.exports = Message; 