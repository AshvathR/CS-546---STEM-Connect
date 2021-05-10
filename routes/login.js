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
        let currentUser = await usersData.checkUsernameandPassword(req.body.username, req.body.password)
        if(errorCheckString(req.body.username) && errorCheckString(req.body.password) && currentUser){
            req.session.user = currentUser; 
            req.session.authenticated = true;
        }
        else{
          res.status(401);
          res.render("employee/login",{currentTitle : "Login", currentHeader : "Login Form", hasErrors : true});
        }
      }
});

router.get('/', async(req,res)=> {
    res.render('general/login', { title: "Log In" ,  auth: false, notLoginPage: false});
})

module.exports = router;


  