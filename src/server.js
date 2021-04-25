var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var authentication = require('./authentication');

var apiLimiterLogin = rateLimit({
    max: 1000
});

var port = 3001;

var server = express();

server.use(helmet());
server.use(bodyParser());
server.use('/', apiLimiterLogin);


server.get('/', (req, res) => {
    res.send('Bienvenidos a mi api de express');
});


server.listen(port, () =>{
    console.log(`servidor corriendo en el puerto ${port}`);
});