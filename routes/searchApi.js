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

router.post('/general', async function(request, response) {
	let searchData = request.body;
    let homeSearchBar = xss(searchData.homeSearchBar);
    let userTypeToggle = xss(searchData.userTypeToggle);
    
    if(!homeSearchBar) throw 'No Object Listed for Search';
    if(!userTypeToggle) throw 'No Object type detected for Search';
    let partialMatch = [];
    console.log(searchData);
    if(userTypeToggle == "User"){
        partialMatch = await data.users.getPartialNameMatch(homeSearchBar);
    }else if(userTypeToggle == "Company"){
        partialMatch = await data.company.getPartialNameMatch(homeSearchBar);
    }else{
        throw 'Object Type Error: ' + userTypeToggle;
    }
    
    response.render('general/search',{
        title: "Search Results for " + searchData.homeSearchBar,
        //auth: request.session.authenticated,
        auth: false,
        partialName:  searchData.homeSearchBar,
        userType: request.session.currentUser,
        notLoginPage:true,
        searchResults: partialMatch,
        isUser: userTypeToggle == "User",
        isFilter: false
    });
});

router.post('/filter',  async function(request, response) {
	let searchData = request.body;
    let yearsExp = xss(searchData.yearsExp);
    let skills = searchData.skills;
    for(skill of skills){
        skill = xss(skill);
    }
    if(!yearsExp || isNaN(yearsExp)) throw 'Invalid field: Years of Experience';
    if(!skills || !Array.isArray(skills) || skills.length < 1) throw 'Invalid field: Skills Array';
    let listings = await data.jobDetails.searchJobByYearSkills(yearsExp, skills);
    response.render('general/search',{
        title: "Filtered Search Results",
        //auth: request.session.authenticated,
        auth: true,
        //userType: request.session.currentUser,
        userType: "company",
        searchResults: listings,
        notLoginPage:true,
        isUser:  request.session.currentUser == "employee",
        isFilter: true

    });
});

router.get('/', async function(request, response) {
    response.render('general/search',{
        title: "Search Page",
        //auth: request.session.authenticated,
        auth: true,
        notLoginPage:true,
        username: request.session.username
    });   
});

module.exports = router;