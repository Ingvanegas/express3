var jwt = require('jsonwebtoken');

var sign = 'Mi_firma_acamica';

module.exports.generateToken = function(data) {
    return jwt.sign(data, sign);
}

module.exports.decode = function(token) {
    return jwt.verify(token, sign);
}

module.exports.verifyUser = function(req, res, usuarios) {
    var token = req.headers.authorization;
    if(token) {
        var decoded = this.decode(token);
        if(decoded) {
            var userName = decoded.userName;
            var password = decoded.password;
            var isAutenticated = usuarios.filter(user => user.user === userName && user.password === password);
            if(isAutenticated.length > 0) {
                return true;
            }else {
                return false;
            }
        }   
    }else {
        return false;
    } 
}