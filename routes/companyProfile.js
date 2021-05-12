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

  const extractJobValue = (body, key="jobTitle") => {
    if (Array.isArray(body[key])) {
      const values = [];
      for(const count in body[key]) {
        const value = jobFields.reduce((acc, value )=> {
          acc[value.propKey] = body[value.elementKey][count] || null
          return acc;
        }, {})
        values.push(value);
      }
      return values;
    } else {
      return [extractValue(body, jobFields)]
    }
  
  }

  
router.get("/:type/form", async (req, res) => {
  res.render("company/companyInfo", {
    title: "STEMConnect",
    auth: false,
    listingType: "Resume",
    notLoginPage: true,
  });
});

router.post("/:type/form", async (req, res) => {
  console.log(req.body);
  const companyInfo = extractValue(req.body, companyFields);
  const jobDetailInfo = extractJobValue(req.body);
  await data.company.addCompany(companyInfo)
  await data.projects.addProject(projectInfo)
  for (const jobDetail of jobDetailInfo) {
    console.log(jobDetail);
    await data.jobDetails.addJob(jobDetail)
  }
  
  
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

router.get('/', async(req,res)=> {
    res.render('company/companyInfo', { title: "Company Details" ,  auth: true, notLoginPage: true});
})


module.exports = router;