const express = require('express');
const router = express.Router();
const data = require('../data');
const xss = require('xss');
const bcrypt = require('bcryptjs');
const usersData = data.users;
const companyData = data.company;
const saltRounds = 16;
const nodemailer = require('nodemailer')

function generateRandomCode(length){
    return Math.random().toString(36).substring(length);
}




module.exports = router;