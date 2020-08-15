const Channel = require('../models/channel.model');
const Message = require('../models/message.model');

module.exports.getAllChannels = async (req, res) => {
    const channels = await Channel.find();
    res.json(channels);
};

module.exports.postCreateChannel = async (req, res) => {
    const { channelName } = req.body;
    
    if ( !(/^(\w)+$/g.test(channelName)) )
        return res.json({error: 'Channel name is invalid'});
    
    const channel = await Channel.findOne({ channelName });

    if (channel) 
        return res.json({ error: 'Channel name already exists'});
    
    let newChannel = new Channel({
        channelName
    });

    newChannel.save((err, newChannel) => {
        if (err) {
            console.log(err);
        }

        console.log('Saved successfully');
        return res.json({ message: 'Create channel successfully', newChannel });
    });
}

module.exports.getMessages = async (req, res) => {
    const { channelId } = req.params;

    const messages = await Message.find({ channelId });

    res.json({ channelId, messages });
}