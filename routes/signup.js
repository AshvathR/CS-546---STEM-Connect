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

router.post('/signup', async (req,res) => {
    if(!req.session.authenticated){
      let username = req.body.username;
      let password = req.body.password;
      let re_password = req.body.reEnterPassword;
      let userType = req.body.usertype;
      let hashedPassword;
      if(userType === "company"){
        if(password === re_password && errorCheckString(password) && errorCheckString(re_password)){
          hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        }
        else{
          res.status(401);
          res.render("employee/login",{currentTitle : "Login", currentHeader : "Login Form", hasErrors : true});
        }
        let checkUsernameExists = companyData.checkExistingUsername(username);
        if(checkUsernameExists && errorCheckString(username)){
          req.session.username = username;
          req.session.hashedPassword = hashedPassword;
          req.session.authenticated
        }
        else{
          res.status(401);
          res.render("employee/login",{currentTitle : "Login", currentHeader : "Login Form", hasErrors : true});
        }
      }
      else{
        if(password === re_password && errorCheckString(password) && errorCheckString(re_password)){
          hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        }
        else{
          res.status(401);
          res.render("employee/login",{currentTitle : "Login", currentHeader : "Login Form", hasErrors : true});
        }
        let checkUsernameExists = usersData.checkExistingUsername(username);
        if(checkUsernameExists && errorCheckString(username)){
          req.session.username = username;
          req.session.hashedPassword = hashedPassword;
          req.session.authenticated
        }
        else{
          res.status(401);
          res.render("employee/login",{currentTitle : "Login", currentHeader : "Login Form", hasErrors : true});
        }
      }
    }
  });

  module.exports = router;