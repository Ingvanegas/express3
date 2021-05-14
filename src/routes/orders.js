var express = require('express');
var router = express.Router();
var actions = require('../database/actions/actions');
var authentication = require('../authentication');

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *      - Orders
 *     description: trae todos las orders del sistema
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
 *         description: todos las orders del sistema
 */
router.get('/orders', authentication.verifyUser, async (req, res) => {
    const orders = await actions.get(`
    SELECT s.Name as State, o.time, o.number, o.description, o.total,
    u.Name as User, u.Addres, o.idpaymentType 
    FROM \`Order\` as o 
    Inner JOIN states as s ON (s.id = o.state) 
    INNER JOIN user as u ON (u.idUser = o.idUser)
    `);
    res.send(orders);
});

router.patch('/orderState/:state', authentication.verifyUser, async (req, res) => {
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

module.exports = router;
