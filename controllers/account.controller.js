const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const Channel = require('../models/channel.model');

module.exports.postSignUp = async (req, res) => {
    const { username, email, password } = req.body;

    if ( !(/([a-zA-Z0-9]+@gmail.com)/g.test(email)) )
        return res.json({email: true});

    if ( !(/(\S)+/g.test(username)) )
        return res.json({username: true});

    if (password.length < 4)
        return res.json({password: true});

    const user = await User.findOne({ email: email });

    if (user) 
        return res.json({ error: 'Email already exists'});

    bcrypt.hash(password, 12, function(err, hash) {
        if (err) console.log(err);

        let user = new User({
            username,
            email,
            password: hash,
            userImageUrl: 'https://res.cloudinary.com/coders-tokyo/image/upload/v1608599766/ro7ag7gldaj6oikmogho.jpg',
        });

        user.save(async (err, user) => {
            if (err) {
                console.log(err);
            }

            await Channel.updateMany({channelType: "public"}, {
                $addToSet: {userList: user._id}
            }).then(result => 
                console.log("push userId into channel successfully")
            )
            .catch(error => console.log(error));

            console.log('Saved successfully');
            return res.json({ message: 'Register user successfully' });
        });
    }); 

};

module.exports.postSignin = async (req, res) => {
    const { email, password } = req.body;
    console.time('someFunction')
    if ( !(/([a-zA-Z0-9]+@gmail.com)/g.test(email)) )
        return res.json({email: true, emailMessage: 'This field is invalid'});
    
    let user = await User.findOne({ email }); 
    
    if (!user) 
        return res.json({ email: true, emailMessage: 'Email is not exist' });

    bcrypt.compare(password, user.password, function(err, result) {
        if (!result) 
            return res.json({password: true});
        
        const token = jwt.sign({
            user: user
        }, 'secret_key_jwt', { expiresIn: '24h' });

        const { _id, email, username, userImageUrl, channelList } = user;

        return res.json({
            message: 'login successfully', 
            token, 
            user: { _id, email, username, userImageUrl, channelList } 
        });
    });    
};

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if ( !(/([a-zA-Z0-9]+@gmail.com)/g.test(email)) )
        return res.json({email: true, emailMessage: 'This field is invalid'});

    let user = await User.findOne({ email }); 
    
    if (!user) 
        return res.json({ email: true, emailMessage: 'Email is not exist' });

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'nguyenphuonglinh11102000@gmail.com',
            pass: 'ykmdjujgkrkqcuct'
        }
    }));

    var mailOptions = {
        from: 'nguyenphuonglinh11102000@gmail.com',
        to: email,
        subject: 'Tiko-Reset Password',
        text: `Reset password link: http://localhost:3000/reset-password/${user._id}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            return res.json({message: 'Reset link are sended to your mailbox, check there first'});
        }
    });
}

module.exports.resetPassword = async (req, res) => {
    const { password } = req.body;
    const { userId } = req.params;

    if (password.length < 4)
        return res.json({password: true});

    bcrypt.hash(password, 12, function(err, hash) {
        if (err) console.log(err);

        User.findByIdAndUpdate({_id: userId }, { password: hash })
        .then(result => {
            if (!result)
                return res.json({ error: 'Reset password is failed'});

            res.json({ message: 'Reset password successfully'});
        })
        .catch(err => console.log(err));
    });
}

module.exports.editProfile = async (req, res) => {
    const { userId } = req.params;
    const { username, userImageUrl } = req.body;

    if (username.trim() === '')
        return res.json({error: 'Username is invalid'});

    User.findByIdAndUpdate({ _id: userId }, { username, userImageUrl })
        .then(result => {
            console.log('edit profile successfully')
            res.json({ message: 'Edit profile succesfully'});
        })
        .catch(err => res.json({ error: 'Edit profile is failed'}));
}
