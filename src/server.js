const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authentication = require('./authentication');


const apiLimiterLogin = rateLimit({
    max: 1000
});

const port = 3000;

const server = express();

server.use(helmet());
server.use(bodyParser());
server.use('/', apiLimiterLogin);


server.get('/', (req, res) => {
    res.send('Bienvenidos a mi nueva api de express');
});

server.post ('/login', (req, res)=>{
    var arg = req.body;
    var userName = arg.user;
    var password = arg.Password;
    const userverified = authentication.verifyUser(req,res,usuarios);
    if (userverified) {
        var data = { userName, password};
        var token = authentication.sing(data);
        res.send ({
            result: 'OK',
            token
        });
    } else {
        res.send({
            result: 'ERROR'
        });
    }
}

)



server.get('/clients', (req, res) => {
const userverified = authentication.verifyUser(req, res, usuarios);
if (userverified) {
    res.send(usuarios);
} else {
    res.send('Errror: ha ocurrido un problema con el token');
}
});

server.get('/client/.idClient', (req, res) => {
    res.send({});
});

server.post('/client', (req, res) => {
    res.sendStatus({});
});

server.put('/client/.idClient', (req, res) => {
    res.send({});
});

server.delete('/client/.idClient', (req, res) => {
    res.send({});
});






server.get('/orders', (req, res) => {
    res.send({});
});

server.get('/order/.idOrder', (req, res) => {
    res.send({});
});

server.post('/order', (req, res) => {
    res.send({});
});

server.put('/order/.idOrder', (req, res) => {
    res.send({});
});

server.delete('/order/.idOrder', (req, res) => {
    res.send({});
});






server.get('/detailproducts/.idOrder', (req, res) => {
    res.send({});
});

server.get('/detailproducts/.idDetailProduct', (req, res) => {
    res.send({});
});

server.post('/detailproducts', (req, res) => {
    res.send({});
});

server.put('/detailproducts/.idDetailProduct', (req, res) => {
    res.send({});
});

server.delete('/detailproducts/.idDetailProduct', (req, res) => {
    res.send({});
});






server.get('/products', (req, res) => {
    res.send({});
});

server.get('/product/.idProduct', (req, res) => {
    res.send({});
});

server.post('/product', (req, res) => {
    res.send({});
});

server.put('/product/.idProduct', (req, res) => {
    res.send({});
});

server.delete('/product/.idProduct', (req, res) => {
    res.send({});
});







server.listen(port, () =>{
    console.log(`servidor corriendo en el puerto ${port}`);
});
