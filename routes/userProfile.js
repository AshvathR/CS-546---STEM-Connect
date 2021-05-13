const express = require('express');
const router = express.Router();
const data = require('../data');
const user = data.users
const resume = data.userResume
const workExperience = data.workExperience;
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
  // const companyInfo = extractValue(req.body, companyFields);
  // const resumeInfo = extractValue(req.body, resumeFields);
  // const projectInfo = extractValue(req.body, projectFields);
  // const jobDetailInfo = extractValue(req.body, projectFields);
  // console.log(companyInfo)
  // await data.company.addCompany(companyInfo)
  // await data.userResume.addResume(resumeInfo)
  // await data.projects.addProject(projectInfo)
  // await data.jobDetails.addJob(jobDetailInfo)
  console.log(req.body)
  const workDes = req.body.workDes

  personalInfo = req.body
  const newUser = await user.addUser(personalInfo.resumeUrl,personalInfo.email,personalInfo.address, personalInfo.firstName, personalInfo.lastName, personalInfo.phoneNumber, personalInfo.aboutMe,personalInfo.gender,personalInfo.dob,personalInfo.resumeUrl,
           'shubham', '$2b$16$XoxM9a/lLskO6Fx5wSpvauSwvGip7XexMvliIQiDSHHtElYEP3n3O')

// Add Work Description
  if(req.body.workDes) {
    if(workDes != null && Array.isArray(workDes.companyName)){
      for(i = 0; i < (workDes.companyName).length; i++){
        const newWorkExperience = await workExperience.addWorkDesc(workDes.companyName[i],workDes.jobTitle[i],workDes.WorkDescription[i],workDes.workStartDate[i],workDes.workEndDate[i]);
        const addWorkDesToUser = await user.addWorkDesToUser(newUser._id, newWorkExperience);
      }
      }
      else{
        const newWorkExperience = await workExperience.addWorkDesc(workDes.companyName,workDes.jobTitle,workDes.WorkDescription,workDes.workStartDate,workDes.workEndDate);
        const addWorkDesToUser = await user.addWorkDesToUser(newUser._id, newWorkExperience);
      }
  }
  
  console.log(newUser)
  
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