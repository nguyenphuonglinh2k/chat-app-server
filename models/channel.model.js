const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

let channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true
    },
    adminId: {
        type: ObjectId,
        ref: "User"
    },
    channelType: {
        type: String,
        required: true
    },
    userList: [ObjectId]
});

let Channel = mongoose.model('Channel', channelSchema, 'channels');

module.exports = Channel; 