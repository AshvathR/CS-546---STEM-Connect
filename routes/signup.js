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

router.post('/', async (req,res) => {
    if(!req.session.authenticated){
      let username = req.body.username;
      let password = req.body.password;
      let re_password = req.body.reEnterPassword;
      let userType = req.body.usertype;
      let hashedPassword;
      if(userType === "company"){
        if(password === re_password && errorCheckString(password) && errorCheckString(re_password)){
          hashedPassword = await bcrypt.hash(password, saltRounds);
        }
        else{
          res.status(401);
          res.render("general/signup",{currentTitle : "Login", currentHeader : "Login Form", hasErrors : true});
        }
        let checkUsernameExists = await companyData.checkExistingUsername(username);
        if(!checkUsernameExists && errorCheckString(username)){
          req.session.username = username;
          req.session.hashedPassword = hashedPassword;
          req.session.currentUser = userType;
          req.session.authenticated = true;
          res.redirect('/profile/create');
        }
        else{
          res.status(401);
          res.render("general/signup",{currentTitle : "Login", currentHeader : "Login Form", hasErrors : true});
        }
      }
      else{
        if(password === re_password && errorCheckString(password) && errorCheckString(re_password)){
          hashedPassword = await bcrypt.hash(password, saltRounds);
        }
        else{
          res.status(401);
          res.render("general/signup",{currentTitle : "Login", currentHeader : "Login Form", hasErrors : true});
        }
        let checkUsernameExists = await usersData.checkExistingUsername(username);
        if(!checkUsernameExists && errorCheckString(username)){
          req.session.username = username;
          req.session.hashedPassword = hashedPassword;
          req.session.currentUser = userType;
          req.session.authenticated = true
          res.redirect('/profile/create');
        }
        else{
          res.status(401);
          res.render("general/signup",{currentTitle : "Login", currentHeader : "Login Form", hasErrors : true});
        }
      }
    }
    
  });

  router.get('/', async (req,res) => {
    res.render('general/signup', { title: "Sign Up" ,  auth: false, notLoginPage:false});
  });


  module.exports = router;