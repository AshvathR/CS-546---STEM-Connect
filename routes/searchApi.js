const express = require('express');
const router = express.Router();
const data = require('../data');
const xss = require('xss');


router.post('/autoCompleteUser', async function(request, response) {
	let partialMatch = await data.users.getPartialNameMatch(xss(request.body.namePartial));
	response.json({match: partialMatch, type: "user"});
});

router.post('/autoCompleteCompany', async function(request, response) {
	let partialMatch = await data.company.getPartialNameMatch(xss(request.body.namePartial));
	response.json({match: partialMatch, type: "company"});
});

router.post('/', async function(request, response) {
	let searchData = request.body;
    if(!searchData.homeSearchBar) throw 'No Object Listed for Search';
    console.log(searchData);
    if(!searchData.userTypeToggle) throw 'No Object type detected for Search';
    let partialMatch = [];
    if(searchData.userTypeToggle == "User"){
        partialMatch = await data.users.getPartialNameMatch(xss(searchData.homeSearchBar));
    }else if(searchData.userTypeToggle == "Company"){
        partialMatch = await data.company.getPartialNameMatch(xss(searchData.homeSearchBar));
    }else{
        throw 'Object Type Error: ' + searchData.userTypeToggle;
    }

    response.render('general/search',{
        title: "Search Results for " + searchData.homeSearchBar,
        auth: false,
        isPost: true,
        partialName:  searchData.homeSearchBar,
        userType: searchData.userTypeToggle,
        searchResults: partialMatch,
        isUser: searchData.userTypeToggle == "User"
    });
});

router.get('/', async function(request, response) {
    response.render('general/search',{
        title: "Search Page",
        auth: false,
        isPost: false,
    });   
});

module.exports = router;