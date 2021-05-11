const express = require('express');
const router = express.Router();
const data = require('../data');
const xss = require('xss');
const {projectFields, resumeFields, companyFields} = require('./constants');

const extractValue = (body, fields) =>
  fields.reduce((acc, { propKey, elementKey }) => {
    const value = body[elementKey];
    return { ...acc, [propKey]: value || null };
  }, {});

router.get("/:type/form", async (req, res) => {
  res.render("company/companyInfo", {
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
    let company = await data.company.getCompanyById(req.params.id);
    res.json(company);
});




module.exports = router;