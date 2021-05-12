const express = require('express');
const router = express.Router();
const data = require('../data/');
router.get('/', async(req,res)=> {
    console.log(req.session._id)
    const userInfo = await user.getUserID(req.session._id)
    console.log(userInfo)

    res.render('employee/profile', { title: "Company Details" ,  auth: true, notLoginPage: true});
})

module.exports = router;
