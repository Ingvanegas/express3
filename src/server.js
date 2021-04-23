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

server.post('/login', (req, res) => {
    var arg = req.body;
    var userName = arg.user;
    var password = arg.password;
    var isAutenticated = usuarios.filter(user => user.user === userName && user.password === password);
    if(isAutenticated.length > 0) {
        var data = { userName, password };
        var token = authentication.generateToken(data);
        res.send({
            result: 'OK',
            token
        });
    }else {
        res.send({
            result: 'ERROR'
        });
    }
});

server.post('/register', (req, res) => {
    var arg = req.body;

    if(!validateEmail(arg.email)) {
        res.send("ERROR: el correo no es tiene el formato correcto");
    }

    usuarios.push(arg);
    res.send(arg);
});

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

server.listen(port, () =>{
    console.log(`servidor correindo en el puerto ${port}`);
});