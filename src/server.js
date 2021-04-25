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


server.listen(port, () =>{
    console.log(`servidor corriendo en el puerto ${port}`);
});
