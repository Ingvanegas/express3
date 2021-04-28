var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var authentication = require('./authentication');

var manager = require('./database/manager/manager');
var actions = require('./database/actions/actions');

var menuModel = require('./database/models/menuModel');
var userModel = require('./database/models/userModel');

var apiLimiterLogin = rateLimit({
    max: 10
});

var port = 3001;

var server = express();

server.use(helmet());
server.use(bodyParser());
server.use('/', apiLimiterLogin);

manager.connect();

server.get('/', (req, res) => {
    res.send('Bienvenidos a mi api de express');
});

server.get('/users', authentication.verifyUser, async (req, res) => {
    const usuarios = await actions.get(userModel.model);
    res.send(usuarios); 
})

server.post('/login', async (req, res) => {
    var arg = req.body;
    var userName = arg.user;
    var password = arg.password;
    const usuarios = await actions.get(userModel.model);
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

server.post('/register', async (req, res) => {
    var arg = req.body;
    const user = await actions.create(userModel.model, arg);
    res.send(arg);
});

server.get('/menus', async (req, res) => {
    const menus = await actions.get(menuModel.model);
    res.send(menus);
});

server.get('/menu/:id', async (req, res) => {
    const menus = await actions.getById(menuModel.model, req.params.id);
    res.send(menus);
});


server.post('/menu', async (req, res) => {
    const menu = await actions.create(menuModel.model, req.body);
    res.send(req.body);
});

server.put('/menu/:id', async (req, res) => {
    const menu = await actions.update(menuModel.model, req.params.id, req.body);
    res.send(req.body);
});

server.delete('/menu/:id', async (req, res) => {
    const menu = await actions.delete(menuModel.model, req.params.id);
    res.send(req.body);
});

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

server.listen(port, () =>{
    console.log(`servidor correindo en el puerto ${port}`);
});