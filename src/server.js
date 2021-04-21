var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');

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

server.post('/login', (req, res) => {
    var arg = req.body;
    var userName = arg.user;
    var password = arg.password;
    var isAutenticated = usuarios.filter(user => user.user === userName && user.password === password);
    if(isAutenticated.length > 0) {
        res.send('OK');
    }else {
        res.send('ERROR');
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

function validateContraseña(password) {
    var Mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var Numeros = '1234567890';
    var Minusculas = 'abcdefghijklmnopqrstuvwxyz';
    for (let index = 0; index < password.length; index++) {
        const caracter = password[index];
        var contieneMayuscula = Mayusculas.includes(caracter);
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

server.listen(port, () =>{
    console.log(`servidor correindo en el puerto ${port}`);
});