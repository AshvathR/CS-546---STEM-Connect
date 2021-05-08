const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const exphbs = require("express-handlebars");
const configRoutes = require('./routes');
const static = express.static(__dirname + '/public');
const data = require('../data');
const loginData = data.loginIfo;

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
    authenticated : false
  })
);

app.post('/login', (req,res) => {
  if(!req.session.authenticated){
    let currentUser = loginData.checkUsernameandPassword(req.body.username, req.body.password)
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

app.post('/signup', (req,res) => {
  if(!req.session.authenticated){
    let username = req.body.username;
    let password = req.body.password;
    let re_password = req.body.reEnterPassword;
    errorCheckString(password);
    errorCheckString(re_password);
    if(password !== re_password){
      res.status(401);
      res.render("employee/login",{currentTitle : "Login", currentHeader : "Login Form", hasErrors : true});
    }
    let userType = req.body.usertype;
    let currentUserDetails = loginData.checkUsernameandPassword(req.body.username, req.body.password);
    if(errorCheckString(req.body.username) && errorCheckString(req.body.password) && currentUserDetails){
        req.session.user = currentUserDetails; 
        req.session.authenticated = true;
    }
    else{
      res.status(401);
      res.render("employee/login",{currentTitle : "Login", currentHeader : "Login Form", hasErrors : true});
    }
  }
});

function errorCheckString(val){
	if(!val)	return false;
	if(val.trim() === '')	return false;
  return true;
}

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
