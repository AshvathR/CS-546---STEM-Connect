const express = require('express');
const router = express.Router();
const data = require('../data');
const user = data.users
const resume = data.userResume
const workExperience = data.workExperience;
const projectFunc = data.projects;
const xss = require('xss');
const {projectFields, resumeFields, companyFields,workFields, userFields} = require('./constants');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const saltRounds = 16;

// const extractValue = (body, fields) =>
//   fields.reduce((acc, { propKey, elementKey }) => {
//     const value = body[elementKey];
//     return { ...acc, [propKey]: value || null };
//   }, {});

// const extractJobValue = (body, fields, key="jobTitle") => {
//   if (Array.isArray(body[key])) {
//     const values = [];
//     for(const count in body[key]) {
//       const value = fields.reduce((acc, value )=> {
//         acc[value.propKey] = body[value.elementKey][count] || null
//         return acc;
//       }, {})
//       values.push(value);
//     }
//     return values;
//   } else {
//     return [extractValue(body, fields)]
//   }

// }


let profilePictureUrl;
let resumeUrl;
const storage = multer.diskStorage({
    //destination for files
    
    destination: function (request, file, callback) {
      console.log(file)
      if(file.fieldname == 'profilePicture')
        callback(null, './public/uploads/employeeFiles/profilePictures');
      else
        callback(null, './public/uploads/employeeFiles/resume');
    },
  
    //add back the extension
    filename: function (request, file, callback) { 
      if(file.fieldname == 'profilePicture'){
        profilePictureUrl =  request.session.username + "_profilePicture.jpeg" 
        callback(null, profilePictureUrl);
      }
      else{
        resumeUrl = request.session.username + "_resume.pdf" 
        callback(null, resumeUrl);
      }
    },
  });
  
  //upload parameters for multer
  const upload = multer({
    storage: storage,
    limits: {
      fieldSize: 1024 * 1024 * 3,
    },
  });



  // const resumeStorage = multer.diskStorage({
  //   //destination for files
  //   destination: function (request, file, callback) {
  //     callback(null, './public/uploads/employeeImages/resume');
  //   },
  
  //   //add back the extension
  //   filename: function (request, file, callback) { 
  //       resumeUrl =  request.session.username + "_resume_.pdf" 
  //     callback(null, resumeUrl);
  //   },
  // });
  
  // //upload parameters for multer
  // const uploadResume = multer({
  //   storage: resumeStorage,
  //   limits: {
  //     fieldSize: 1024 * 1024 * 3,
  //   },
  // });

router.get("/:type/form", async (req, res) => {
  res.render("employee/employeeInfo", {
    title: "STEMConnect",
    auth: false,
    listingType: "Resume",
    notLoginPage: true,
  });
});

let multipleUpload = upload.fields([{ name: 'profilePicture' }, {name:'uploadResume'}]) 

router.post("/createNewUser", multipleUpload, async (req, res) => {
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
  const school = req.body.School
  const project = req.body.project

  personalInfo = req.body;
  // if((/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/).test(personalInfo.websiteUrl) === true){
  //   personalInfo.websiteUrl = "you are shit"
  // }
  // else{
  //   personalInfo.websiteUrl = "you are shittttttttt"
  // }
 // personalInfo.websiteUrl = (personalInfo.websiteUrl).test(/^https?\:\/\/(www.)?/, "");
  // console.log(personalInfo.websiteUrl);
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  // Add User
  const newUser = await user.addUser(`/public/uploads/employeeFiles/profilePictures/${profilePictureUrl}`,
            personalInfo.email,
            personalInfo.address, 
            personalInfo.firstName, 
            personalInfo.lastName, 
            personalInfo.phoneNumber, 
            personalInfo.aboutMe,
            personalInfo.gender,
            personalInfo.dob,
            `/public/uploads/employeeFiles/resume/${resumeUrl}`,
            personalInfo.username,
            personalInfo.websiteUrl,
            hashedPassword)
          

  req.session._id = newUser._id
// Add Education
let education= []
if(req.body.School) {
  if(school != null && Array.isArray(school.schoolName))
  {
      for(i = 0; i < (school.schoolName).length; i++)
      {
          tempSchool = 
          {
            schoolName: school.schoolName[i],
            startDate: school.startDate[i],
            endDate: school.endDate[i],
            gpa: school.gpa[i]
          }
        education.push(tempSchool)
      }
    }
    else
    {
      tempSchool = 
        {
          schoolName: school.schoolName,
          startDate: school.startDate,
          endDate: school.endDate,
          gpa: school.gpa
        }
      education.push(tempSchool)
    }
  }
  const skills = (req.body.resume.skills).split(',')

//Add Resume
  const newResume = await resume.addResume(education,skills,'',`CS_546_group23_final_project/public/uploads/employeeImages/resume/${resumeUrl}`,req.body.resume.workStatus,req.body.resume.year,true)

// Add project
if(req.body.project) {
  if(project != null && Array.isArray(project.projectTitle)){
    for(i = 0; i < (project.projectTitle).length; i++){
      try{
        const newProject = await projectFunc.addProject(project.projectTitle[i],project.projectDesc[i],project.startDate[i],project.endDate[i]);
        const addProjectToUserResume = await resume.addProjectToUserResume(newResume._id,newProject)
    }catch(e)
    {
        console.log(e)
    }
    }
    }
    else{
      try{
        const newProject = await projectFunc.addProject(project.projectTitle,project.projectDesc,project.startDate,project.endDate);
        const addProjectToUserResume = await resume.addProjectToUserResume(newResume._id,newProject)
    }catch(e)
    {
        console.log(e)
    }
    }
}

//Add Resume to user
try{
  const addResumeToUser = await user.addResumeToUser(newUser._id,newResume)
} catch(e){
  console.log(e)
}
  

  // Add Work Description
  if(req.body.workDes) {
    if(workDes != null && Array.isArray(workDes.companyName)){
      for(i = 0; i < (workDes.companyName).length; i++){
        try{
          const newWorkExperience = await workExperience.addWorkDesc(workDes.companyName[i],workDes.jobTitle[i],workDes.WorkDescription[i],workDes.workStartDate[i],workDes.workEndDate[i]);
          const addWorkDesToUser = await user.addWorkDesToUser(newUser._id, newWorkExperience);
        }catch(e)
        {
          console.log(e)
        }
      }
      }
      else{
        try{
          const newWorkExperience = await workExperience.addWorkDesc(workDes.companyName,workDes.jobTitle,workDes.WorkDescription,workDes.workStartDate,workDes.workEndDate);
          const addWorkDesToUser = await user.addWorkDesToUser(newUser._id, newWorkExperience);
        }catch(e)
        {
          console.log(e)
        }

      }
  }
  // console.log(newUser)
  
  // res.render("company/successScreen", {
  //   title: "STEMConnect",
  //   auth: false,
  //   listingType: "Resume",
  //   notLoginPage: true,
  // });
  res.redirect('/profile');
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
router.post('/updatePicture', upload.single('profilePicture'),async(req,res)=>{
  console.log("reached");
  res.redirect('/profile');
})
router.post('/updateResumefile', upload.single('resumeUrl'),async(req,res)=>{
  console.log("reached");
  res.redirect('/profile');
})



module.exports = router;