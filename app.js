const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const exphbs = require("express-handlebars");
const configRoutes = require('./routes');

app.use(express.json());





app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
