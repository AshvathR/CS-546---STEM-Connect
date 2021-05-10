const express = require('express');
const router = express.Router();
const data = require('../data');
const xss = require('xss');




router.get('/:id', async (req, res) => {
    let user = await data.users.getUserById(req.params.id);
    res.json(user);
});




module.exports = router;