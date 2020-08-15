const jwt = require('jsonwebtoken');

module.exports.requiredLogin = (req, res, next) => {
    let { authorization } = req.headers;

    authorization = authorization.slice(5);

    if (!authorization) 
        return res.json({ error: 'You must be logged in' });
    
    jwt.verify(authorization, 'secret_key_jwt' , function(err, payload) {
        if (err) {
            console.log(err);
            return res.json({ error: 'You must be logged in'});
        }
        req.user = payload.user; 
        next();    
    });
}