const express = require('express');
const router = express.Router();
const data = require('../data');
const xss = require('xss');

router.get('/autoComplete', function(request, response) {
	
	// response.json({ success: true, message: request.body.description });
	response.json({success: true, userList: data.users.getAllUsers()});
});


module.exports = router;