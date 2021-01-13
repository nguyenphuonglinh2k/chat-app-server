const Channel = require('../models/channel.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');

module.exports.getAllChannels = async (req, res) => {
    const channels = await Channel.find();
    res.json(channels);
};

module.exports.getMessages = async (req, res) => {
    const { channelId } = req.params;

    let messages = await Message
                    .find({ channelId })
                    .populate("user", "_id username email userImageUrl"); 

    res.json({ channelId, messages });
}

module.exports.postCreateChannel = async (req, res) => {
    const { channelName, channelType , adminId } = req.body;
    let userList = [adminId];

    if (!channelType) channelType = "public";
    
    if ( !(/^(\w)+$/g.test(channelName)) )
        return res.json({error: 'Channel name is invalid'});
    
    const channel = await Channel.findOne({ channelName });
    
    if (channel) 
        return res.json({ error: 'Channel name already exists'});

    
    if (channelType === "public") {
        const users = await User.find({}).select("_id");
        userList = users.map(user => user._id)
    }
    
    let newChannel = new Channel({
        channelName,
        channelType,
        adminId,
        userList
    });

    newChannel.save((err, newChannel) => {
        if (err) {
            console.log(err);
        }

        console.log('Saved successfully');
        return res.json({ message: 'Create channel successfully', newChannel });
    });
}

module.exports.postDeleteChannel = async (req, res) => {
    const { channelId } = req.params;

    await Channel.deleteOne({ _id: channelId}).then(res => console.log(res));

    await Message.deleteMany({ channelId: channelId}); 
}

module.exports.postAddUserToChannel = async (req, res) => {
    const { email } = req.body;
    const { channelId } = req.params;

    if ( !(/([a-zA-Z0-9]+@gmail.com)/g.test(email)) )
        return res.json({error: 'Email is invalid'});

    const user = await User.findOne({ email: email });

    if (!user)
        return res.json({error: 'Email is not exist'});
    
    await Channel.findByIdAndUpdate({ _id: channelId }, {
        $addToSet: {userList: user._id}
    }, {
        new: true
    }).then(result => 
        res.json({message: 'Add user successfully'})
    )
    .catch(err => console.log(err));
}

module.exports.postDeleteUser = async (req, res) => {
    const { email } = req.body;
    const { channelId } = req.params;

    if ( !(/([a-zA-Z0-9]+@gmail.com)/g.test(email)) )
        return res.json({error: 'Email is invalid'});

    const user = await User.findOne({ email: email });

    if (!user)
        return res.json({error: 'Email is not exist'});
    
    await Channel.findByIdAndUpdate({ _id: channelId }, {
        $pull: {userList: user._id}
    }, {
        new: true
    }).then(result => {
        res.json({message: 'Delete user successfully'})
    })
    .catch(err => console.log(err));
}