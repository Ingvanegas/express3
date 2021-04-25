const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authentication = require('./authentication');

var apiLimiterLogin = rateLimit({
    max: 1000
});

var port = 3000;

var server = express();

server.get('/', (req, res) => {
    res.send('Bienvenidos a mi api de express');
});


server.listen(port, () =>{
    console.log(`servidor corriendo en el puerto ${port}`);
});