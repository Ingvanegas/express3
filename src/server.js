var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var authentication = require('./authentication');
var swaggerJsDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var actions = require('./database/actions/actions');

var swaggerDefinition = require('./swaggerDefinitons');

var users = require('./routes/users')

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



server.get('/orders', authentication.verifyUser, async (req, res) => {
    const orders = await actions.get(`
    SELECT s.Name as State, o.time, o.number, o.description, o.total,
    u.Name as User, u.Addres, o.idpaymentType 
    FROM \`Order\` as o 
    Inner JOIN states as s ON (s.id = o.state) 
    INNER JOIN user as u ON (u.idUser = o.idUser)
    `);
    res.send(orders);
});

server.patch('/orderState/:state', authentication.verifyUser, async (req, res) => {
    const userLogged = req.user;
    if(userLogged.role == 1) {
        const order = await actions.update(
            `UPDATE \`order\` SET state = :state`, 
            { state: req.params.state });
        res.send(user);
    }else {
        res.send('Error: role invalid');
    }
    
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