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
        res.render('employee/profile', { title: "User Details" , user : userInfo ,  auth: true, notLoginPage: true, username: req.session.username});
    } else {
        const companyInfo = await company.getCompanyById(req.session._id)
        // console.log(companyInfo)
        res.render('company/profile', { title: "Company Details" , company : companyInfo,  auth: true, notLoginPage: true, username: req.session.username});
    }
});

router.get('/user/:id', async(req,res)=> {
    //if(req.session._id == req.params.id) res.redirect('/');
    const userInfo = await user.getUserById(req.params.id);
    // console.log(userInfo)
    res.render('employee/profile', { title: "Company Details" , user : userInfo ,  auth: req.session.authenticated, notLoginPage: true, username: req.session.username});

});

router.get('/company/:id', async(req,res)=> {
    //if(req.session._id == req.params.id) res.redirect('/');
    const companyInfo = await company.getCompanyById(req.params.id)
    // console.log(companyInfo)
    res.render('company/profile', { title: "Company Details" , company : companyInfo,  auth: req.session.authenticated, notLoginPage: true, username: req.session.username}); 
});



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
