var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var authentication = require('./authentication');

var actions = require('./database/actions/actions');

var apiLimiterLogin = rateLimit({
    max: 10
});

var port = 3001;

var server = express();

server.use(helmet());
server.use(bodyParser());
server.use('/', apiLimiterLogin);

server.get('/', (req, res) => {
    res.send('Bienvenidos a mi api de express');
});

server.post('/login', async (req, res) => {
    var arg = req.body;
    var user = arg.user;
    var password = arg.password;
    const usuarios = await actions.get('SELECT * FROM users WHERE userName = :user AND password = :password', { user, password })
    var isAutenticated = usuarios.filter(userf => userf.userName === user && userf.password === password);
    if(isAutenticated.length > 0) {
        var data = { user, password };
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

server.get('/users', authentication.verifyUser, async (req, res) => {
    const users = await actions.get('SELECT * FROM users');
    res.send(users);
});

server.get('/user/:id', authentication.verifyUser, async (req, res) => {
    const user = await actions.get('SELECT * FROM users WHERE id = :id', { id: req.params.id });
    res.send(user);
});


server.post('/user', authentication.verifyUser, async (req, res) => {
    const user = await actions.create(
        `INSERT INTO users (userName, name, email, phone, address, password) 
        VALUES (:userName, :name, :email, :phone, :address, :password)`, 
        req.body);
    res.send(user);
});

// server.put('/user/:id', authentication.verifyUser, async (req, res) => {
//     const user = await actions.update(menuModel.model, req.params.id, req.body);
//     res.send(req.body);
// });

// server.delete('/user/:id', authentication.verifyUser,async (req, res) => {
//     const user = await actions.delete(menuModel.model, req.params.id);
//     res.send(req.body);
// });

server.listen(port, () =>{
    console.log(`servidor correindo en el puerto ${port}`);
});