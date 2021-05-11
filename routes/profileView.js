const express = require('express');
const router = express.Router();
router.get('/', async(req,res)=> {
    res.render('employee/profile', { title: "Company Details" ,  auth: true, notLoginPage: true});
})

module.exports = router;
