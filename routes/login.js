const express = require('express');
const router = express.Router();
const data = require('../data');
const xss = require('xss');
const bcrypt = require('bcryptjs');
const usersData = data.users;
const companyData = data.company;
const saltRounds = 16;

function errorCheckString(val){
	if(!val)	return false;
	if(val.trim() === '')	return false;
  return true;
}

router.post('/', async (req, res) => {
      if(!req.session.authenticated){
        // console.log(req.body.username)
        let currentUser = await usersData.checkUsernameandPassword(req.body.username, req.body.password);
        let currentCompany = await companyData.checkUsernameandPassword(req.body.username, req.body.password);
        if(errorCheckString(req.body.username) && errorCheckString(req.body.password) && currentUser){
            req.session.currentUser = "employee";
            req.session.authenticated = true;
            let currentUsername = req.body.username.toLowerCase();
            let currentID = await usersData.getUserID(currentUsername);
            // res.render('employee/profile', { title: "Employee profile" ,  auth: true, notLoginPage: true});
            res.redirect(`/user/${currentID}`);
        }
        else if(errorCheckString(req.body.username) && errorCheckString(req.body.password) && currentCompany){
            req.session.currentUser = "company";
            req.session.authenticated = true;
            let currentUsername = req.body.username.toLowerCase();
            let currentID = await companyData.getUserID(currentUsername);
            // res.render('company/profile', { title: "Company profile" ,  auth: true, notLoginPage: true});
            res.redirect(`/company/${currentID}`);
        }
        else{
          // console.log("else")
          res.status(401);
          res.render('general/login', { title: "Log In" ,  auth: false, notLoginPage: false});
        }
      }
      else{
        if(req.session.currentUser =="company"){
          res.redirect('/company');
        }
        else if(req.session.currentUser =="employee"){
          res.redirect('/user');
        }
      }
});

router.get('/', async(req,res)=> {
  if(!req.session.authenticated)
    res.render('general/login', { title: "Log In" ,  auth: false, notLoginPage: false});
  else if(req.session.currentUser == "company")
    res.redirect('/company');
  else
    res.redirect('/user');  
})

module.exports = router;


  