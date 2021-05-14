var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var authentication = require('./authentication');
var swaggerJsDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var actions = require('./database/actions/actions');

var swaggerDefinition = require('./swaggerDefinitons');

var users = require('./routes/users');
var orders = require('./routes/orders');

var apiLimiterLogin = rateLimit({
    max: 100
});

var port = 3001;

const options = {
    ...swaggerDefinition,
    apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJsDoc(options);

var server = express();

server.use(helmet());
server.use(bodyParser());
server.use('/', apiLimiterLogin);
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.use('/', users);
server.use('/', orders);

server.get('/', (req, res) => {
    res.send('Bienvenidos a mi api de express');
});

server.get('/api-docs.json', (req, res) => {
    res.send(swaggerSpec);
});

server.post('/login', async (req, res) => {
    var arg = req.body;
    var user = arg.user;
    var password = arg.password;
    const usuarios = await actions.get('SELECT UserName, Type FROM user WHERE UserName = :user AND Password = :password', { user, password })
    if(usuarios.length > 0) {
        var data = { user, password, role: usuarios[0].Type };
        var token = authentication.generateToken(data);
        res.send({
            result: 'OK',
            role: usuarios[0].Type,
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