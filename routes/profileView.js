const express = require('express');
const router = express.Router();
const data = require('../data/');
const user = data.users
const company = data.company
router.get('/', async(req,res)=> {
    // console.log(req.session)
    if (req.session.currentUser == 'employee') {
        const userInfo = await user.getUserById(req.session._id)
        // console.log(userInfo)
        res.render('employee/profile', { title: "Company Details" , user : userInfo ,  auth: true, notLoginPage: true});
    } else {
        const companyInfo = await company.getCompanyById(req.session._id)
        // console.log(companyInfo)
        res.render('company/profile', { title: "Company Details" , company : companyInfo,  auth: true, notLoginPage: true});
    }
})

router.get('/create', async(req,res)=>{
    console.log(req.session.currentUser)
    if(req.session.currentUser == 'employee'){
        res.render('employee/employeeInfo', { title: "Employee Details" , auth: true, notLoginPage: true});
    }
    else{
        res.render('company/companyInfo', { title: "Company Details" , auth: true, notLoginPage: true});
    }
})

module.exports = router;
