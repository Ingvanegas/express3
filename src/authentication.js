var jwt = require('jsonwebtoken');

var sign = 'Mi_firma_acamica';

module.exports.generateToken = function(data) {
    return jwt.sign(data, sign);
}

function decode (token) {
    return jwt.verify(token, sign);
}

module.exports.verifyUser = function(req, res, next) {
    var token = req.headers.authorization;
    if(token) {
        var decoded = decode(token, sign);
        if(decoded) {
          next();
        }   
    }else {
        return false;
    } 
}