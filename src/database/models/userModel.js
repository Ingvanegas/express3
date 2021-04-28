const mongoose = require('mongoose');

schema = { 
    nombre: String, 
    apellido: String, 
    edad: String,
    email: String,
    password: String,
    user: String
};

module.exports.model = mongoose.model('User', schema);