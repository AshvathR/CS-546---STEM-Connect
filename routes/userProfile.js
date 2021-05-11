const express = require('express');
const router = express.Router();
const data = require('../data');
const xss = require('xss');




router.get('/:id', async (req, res) => {
    let user = await data.users.getUserById(req.params.id);
    res.json(user);
});

router.get('/', async(req,res)=> {
    res.render('employee/employeeInfo', { title: "Employee Details" ,  auth: true, notLoginPage: true});
})


module.exports = router;