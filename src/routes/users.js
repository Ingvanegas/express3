var express = require('express');
var router = express.Router();
var actions = require('../database/actions/actions');
var authentication = require('../authentication');

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *      - Users
 *     description: trae todos los usuarios del sistema
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Identificador unico del usuario.
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: todos los usuarios del sistema
 */
router.get('/users', authentication.verifyUser, async (req, res) => {
    const users = await actions.get('SELECT * FROM users');
    res.send(users);
});

/**
 * @swagger
 * /user/:id:
 *   get:
 *     tags:
 *      - Users
 *     description: Trae el usuario del sistema al que pertence el id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id del usuario.
 *         schema:
 *           type: integer
 *       - in: header
 *         name: token
 *         required: true
 *         description: Identificador unico del usuario.
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: usuario del sistema al que pertence el id
 */
router.get('/user/:id', authentication.verifyUser, async (req, res) => {
    const user = await actions.get('SELECT * FROM users WHERE id = :id', { id: req.params.id });
    res.send(user);
});

/**
 * @swagger
 * /userByUsername/:userName:
 *   get:
 *     tags:
 *      - Users
 *     description: Trae el usuario del sistema al que pertence el nombre
 *     parameters:
 *       - in: path
 *         name: userName
 *         required: true
 *         description: Nombre del usuario.
 *         schema:
 *           type: string
 *       - in: header
 *         name: token
 *         required: true
 *         description: Identificador unico del usuario.
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: usuario del sistema al que pertence el nombre
 */
router.get('/userByUsername/:userName', authentication.verifyUser, async (req, res) => {
    const user = await actions.get('SELECT * FROM user WHERE UserName = :userName', { id: req.params.userName });
    res.send(user);
});

/**
 * @swagger
 * /userAdmin:
 *   post:
 *     tags:
 *      - Users
 *     description: Inserta un usuario administrador a la bd
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Identificador unico del usuario.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/User'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Usuario insertado
 */
router.post('/userAdmin', authentication.verifyUser, async (req, res) => {
    const user = await actions.create(
        `INSERT INTO user (UserName, Name, Password, Email, Phone, Addres, Type) 
        VALUES (:userName, :name, :password, :email, :phone, :address, 1)`, 
        req.body);
        res.send(user);
});

/**
 * @swagger
 * /userClient:
 *   post:
 *     tags:
 *      - Users
 *     description: Inserta un usuario cliente a la bd
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Identificador unico del usuario.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/User'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Usuario insertado
 */
router.post('/userClient', authentication.verifyUser, async (req, res) => {
    const user = await actions.create(
        `INSERT INTO user (UserName, Name, Password, Email, Phone, Addres, Type) 
        VALUES (:userName, :name, :password, :email, :phone, :address, 2)`, 
        req.body);
    res.send(user);
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           description: The user's name.
 *           example: LGraham
 *         Name:
 *           type: string
 *           description: The name of the user.
 *           example: Leanne Graham
 *         Password:
 *            type: string
 *            description: The password of the user.
 *            example: 1234
 *         Email:
 *            type: string
 *            description: The Email of the user.
 *            example: LGraham@gmail.com
 *         address:
 *            type: string
 *            description: The address of the user.
 *            example: calle falsa 123
 *         Type:
 *            type: integer
 *            description: The type of the user.
 *            example: 2
 */