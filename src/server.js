var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var authentication = require('./authentication');

var apiLimiterLogin = rateLimit({
    max: 10
});

var port = 3001;

var server = express();

server.use(helmet());
server.use(bodyParser());
server.use('/', apiLimiterLogin);

var usuarios = [];

server.get('/', (req, res) => {
    res.send('Bienvenidos a mi api de express');
});

server.get('/users', (req, res) => {
    const userverified = authentication.verifyUser(req, res, usuarios);
    if(userverified) {
        res.send(usuarios);   
    }else {
        res.send('Error: ah ocurrido un problema con el token');   
    }   
})



function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

server.listen(port, () =>{
    console.log(`servidor correindo en el puerto ${port}`);
});