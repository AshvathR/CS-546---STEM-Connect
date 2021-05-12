const express = require('express');
const router = express.Router();
const data = require('../data/');
router.get('/', async(req,res)=> {
    console.log(req.session)
    if (req.session.currenUser == 'employee') {
        res.render('employee/profile', { title: "Company Details" ,  auth: true, notLoginPage: true});
    } else {
        res.render('company/profile', { title: "Company Details" ,  auth: true, notLoginPage: true});
    }
})

module.exports = router;
