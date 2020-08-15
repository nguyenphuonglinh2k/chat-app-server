const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var jwt = require('jsonwebtoken');

const User = require('../models/user.model');

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
            userImageUrl: 'http://skote-v-light.react.themesbrand.com/static/media/avatar-1.67e2b9d7.jpg'
        });

        user.save((err, user) => {
            if (err) {
                console.log(err);
            }

            console.log('Saved successfully');
            return res.json({ message: 'Register user successfully' });
        });
    }); 

};

module.exports.postSignin = async (req, res) => {
    const { email, password } = req.body;

    if ( !(/([a-zA-Z0-9]+@gmail.com)/g.test(email)) )
        return res.json({email: true, emailMessage: 'This field is invalid'});

    let user = await User.findOne({ email: email});
    
    if (!user) 
        return res.json({ email: true, emailMessage: 'Email is not exist' });

    bcrypt.compare(password, user.password, function(err, result) {
        if (!result) 
            return res.json({password: true});
        
        const token = jwt.sign({
            user: user
        }, 'secret_key_jwt', { expiresIn: '24h' });

        const { _id, email, username, userImageUrl } = user;

        return res.json({message: 'login successfully', token, user: { _id, email, username, userImageUrl } });
    });    
};

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if ( !(/([a-zA-Z0-9]+@gmail.com)/g.test(email)) )
        return res.json({email: true, emailMessage: 'This field is invalid'});

    let user = await User.findOne({ email: email });
    
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

    console.log(userId);

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
