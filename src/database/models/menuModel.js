const mongoose = require('mongoose');

schema = { 
    plato: String, 
    precio: Number, 
    tipo_de_plato: String
};

module.exports.model = mongoose.model('Menu', schema);