const express = require('express');
const router = express.Router();
const data = require('../data');
const xss = require('xss');
const {projectFields, resumeFields, companyFields,workFields, userFields} = require('./constants');

const extractValue = (body, fields) =>
  fields.reduce((acc, { propKey, elementKey }) => {
    const value = body[elementKey];
    return { ...acc, [propKey]: value || null };
  }, {});

const extractJobValue = (body, fields, key="jobTitle") => {
  if (Array.isArray(body[key])) {
    const values = [];
    for(const count in body[key]) {
      const value = fields.reduce((acc, value )=> {
        acc[value.propKey] = body[value.elementKey][count] || null
        return acc;
      }, {})
      values.push(value);
    }
    return values;
  } else {
    return [extractValue(body, fields)]
  }

}


router.get("/:type/form", async (req, res) => {
  res.render("employee/employeeInfo", {
    title: "STEMConnect",
    auth: false,
    listingType: "Resume",
    notLoginPage: true,
  });
});

router.post("/:type/form", async (req, res) => {
  const companyInfo = extractValue(req.body, companyFields);
  const resumeInfo = extractValue(req.body, resumeFields);
  const projectInfo = extractValue(req.body, projectFields);
  const jobDetailInfo = extractValue(req.body, projectFields);
  await data.company.addCompany(companyInfo)
  await data.userResume.addResume(resumeInfo)
  await data.projects.addProject(projectInfo)
  await data.jobDetails.addJob(jobDetailInfo)
  
  res.render("company/successScreen", {
    title: "STEMConnect",
    auth: false,
    listingType: "Resume",
    notLoginPage: true,
  });
});



router.get('/:id', async (req, res) => {
    let user = await data.users.getUserById(req.params.id);
    res.json(user);
});

router.get('/', async(req,res)=> {
    res.render('employee/employeeInfo', { title: "Employee Details" ,  auth: true, notLoginPage: true});
});

router.get('/resume/:id', async (req, res) => {
  let user = await data.userResume.getResumeById(req.params.id);
  res.json(user);
});



module.exports = router;