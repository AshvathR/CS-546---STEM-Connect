const express = require('express');
const router = express.Router();
const data = require('../data');
const xss = require('xss');




router.get('/:id', async (req, res) => {
    let company = await data.company.getCompanyById(req.params.id);
    res.json(company);
});




module.exports = router;