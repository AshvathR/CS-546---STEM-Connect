const express = require('express');
const router = express.Router();
const data = require('../data/');
const { updateUser } = require('../data/users');
const user = data.users
const resume = data.userResume
const companyFunc = data.company
const jobs = data.jobDetails;
const projectFunc = data.projects;
const multer = require('multer');

let profilePictureUrl;
let resumeUrl;
const storage = multer.diskStorage({
    //destination for files
    
    destination: function (request, file, callback) {
      console.log(file)
      if(file.fieldname == 'profilePicture')
        callback(null, './public/uploads/companyFiles/profilePictures');
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

router.get('/', async(req,res)=> {
    // console.log(req.session)
    // req.flash('userId', req.session._id)
    if (req.session.currentUser == 'employee') {
        const userInfo = await user.getUserById(req.session._id)
        let lowercaseUsername = (userInfo.username).toLowerCase()
        // console.log(userInfo)
        res.render('employee/profile', { title: "User Details" , user : userInfo , lowercaseUsername: lowercaseUsername,  auth: true, notLoginPage: true, username: req.session.username});
    } else {
        const companyInfo = await companyFunc.getCompanyById(req.session._id);

        let lowercaseCompanyname = (companyInfo.username).toLowerCase()
        
        // console.log(companyInfo)
        res.render('company/profile', { title: "Company Details" , company : companyInfo,lowercaseCompanyname: lowercaseCompanyname ,  auth: true, notLoginPage: true, username: req.session.username});
    }
});

router.get('/user/:id', async(req,res)=> {
    //if(req.session._id == req.params.id) res.redirect('/');
    console.log("Reached")
    const userInfo = await user.getUserById(req.params.id);
    let lowercaseUsername = (userInfo.username).toLowerCase()
    console.log(lowercaseUsername)
    res.render('employee/profileView', { title: "User Details" , user : userInfo ,lowercaseUsername: lowercaseUsername,  auth: req.session.authenticated, notLoginPage: true, username: req.session.username});

});

router.post('/updatePicture', upload.single('profilePicture'), async(req,res)=>
{
  console.log("reached"); 
  res.redirect('/profile');
});

router.get('/company/:id', async(req,res)=> {
    //if(req.session._id == req.params.id) res.redirect('/');
    const companyInfo = await companyFunc.getCompanyById(req.params.id);
    // let x = (companyInfo.jobDetails.skills).length;
    // console.log(x);
    // console.log(companyInfo)
    res.render('company/profileView', { title: "Company Details" , company : companyInfo,  auth: req.session.authenticated, notLoginPage: true, username: req.session.username}); 
});

router.post("/addJob", async (req, res) =>
{
    let htmlValue = req.body;
    let skillsArray = htmlValue.skills.split(",");
    let companyId = htmlValue.companyId;

    let newJob = 
    {
        jobTitle: htmlValue.jobTitle,
        jobLocation: htmlValue.jobLocation,
        jobDescription: htmlValue.jobDescription,
        yearsOfExperience: parseInt(htmlValue.yearsOfExperience),
        skills: skillsArray,
        jobCategory: htmlValue.jobCategory,
        salaryMin: htmlValue.salaryMin,
        salaryMax: htmlValue.salaryMax,
        qualifications: htmlValue.jobQualification,
        jobStatus: true
    }

    const addNewJob = await jobs.addJob(newJob.jobTitle,
        newJob.jobLocation,
        newJob.jobDescription,
        newJob.yearsOfExperience,
        newJob.skills,
        newJob.jobCategory,
        newJob.salaryMin,
        newJob.salaryMax,
        newJob.qualifications,
        newJob.jobStatus);

    const addNewJobToCompany = await companyFunc.addJobToCompany(companyId, newJob);

    res.redirect("/profile");
});

router.post("/editJob", async (req, res) => 
{
    let jobInfo = req.body.jobDetails;
    // console.log(jobInfo.jobStatus);
    let companyId = jobInfo.companyId;
    let jobId = jobInfo.id;
    let skills = (jobInfo.skills).split(",");
    skills = skills.join();

    if (jobInfo.jobStatus == null || jobInfo.jobStatus == "false") {
        jobInfo.jobStatus = false;
    } else {
        jobInfo.jobStatus = true;
    }

    let jobUpdateInfo = 
    {
        jobTitle: jobInfo.jobTitle,
        jobLocation: jobInfo.jobLocation,
        jobDescription: jobInfo.jobDescription,
        yearsOfExperience: jobInfo.yearsOfExperience,
        skills: skills,
        jobCategory: jobInfo.jobCategory,
        salaryMin: jobInfo.salaryMin,
        salaryMax: jobInfo.salaryMax,
        qualifications: jobInfo.qualifications,
        jobStatus: jobInfo.jobStatus
    };

    // console.log(jobUpdateInfo.jobStatus);

    let x = (jobUpdateInfo.skills).length;
    // console.log(x, jobUpdateInfo.skills);
    jobUpdateInfo.skills = jobUpdateInfo.skills.split(',', x-2);
    // console.log(x, jobUpdateInfo.skills);
    
    const updatedJob = await jobs.updateJob(jobId, jobUpdateInfo, companyId);
    // console.log(newJob);
    res.redirect("/profile");
});

router.post('/editResume', async (req,res)=> {
    // let userId = req.flash('userId')
    userId = req.body.resume.userid
    resId = req.body.resume.id
    // console.log((req.body.resume.School.schoolName).length)
    // console.log(JSON.stringify(req.body.resume))

    let education= []
    let project = []

    for(i = 0; i < (req.body.resume.School.schoolName).length; i++){
        tempSchool = {
            schoolName: req.body.resume.School.schoolName[i],
            startDate: req.body.resume.School.startDate[i],
            endDate: req.body.resume.School.endDate[i],
            gpa: req.body.resume.School.gpa[i]
        }
        education.push(tempSchool)
    }
    // console.log(req.body.resume.project)
    // console.log(req.body.resume.project.projectTitle)
    if(Array.isArray(req.body.resume.project.projectTitle)){
    for(i = 0; i < (req.body.resume.project.projectTitle).length; i++){
        temp = {
            projectTitle: req.body.resume.project.projectTitle[i],
            startDate: req.body.resume.project.startDate[i],
            endDate: req.body.resume.project.endDate[i],
            description: req.body.resume.project.description[i]
        }
        project.push(temp)
    }
    }
    else{
        temp = {
            projectTitle: req.body.resume.project.projectTitle,
            startDate: req.body.resume.project.startDate,
            endDate: req.body.resume.project.endDate,
            description: req.body.resume.project.description
        }
        project.push(temp)
    }
    // console.log(temp)

    const skills = (req.body.resume.skills).split(',')
    // console.log(temp)
    // console.log(project)

    if( req.body.resume.resumeActive == null){
        req.body.resume.resumeActive = false
    } else if( req.body.resume.resumeActive == "true"){
        req.body.resume.resumeActive = true
    } else if ( req.body.resume.resumeActive == "false"){
        req.body.resume.resumeActive = false
    }

    let resumeUpdateInfo =
      {
        education: education,
        projects: project,
        skills: skills,
        workStatus: req.body.resume.workStatus,
        description: req.body.resume.description,
        resumeActive: req.body.resume.resumeActive,
        userResumeUrl: "updatedResume.userResumeUrl"
      }
    //   console.log(resumeUpdateInfo)
    //   console.log(resId + ' ' + userId)
      try{
        const newUser = await resume.updateResume(resId, userId, resumeUpdateInfo)
        // console.log(newUser)
      }catch(e){
          console.log(e)
      }
      res.redirect('/profile')
    // console.log(JSON.stringify(req.body.resume.resumeActive))

});

router.post("/editCompanyInfo", async (req, res) => 
{
    let companyInfo = req.body;

    updatedCompany = 
    {
        companyName: companyInfo.companyName,
        location: companyInfo.location,
        category: companyInfo.category,
        hrEmail: companyInfo.hrEmail
    };

    try {
        const newCompany = await companyFunc.updateCompany(companyInfo.companyId, updatedCompany);
        console.log(newCompany);
    } catch (e) {
        console.log(e);
    }
    res.redirect("/profile");
});

router.post('/editPersonalInfo', async (req,res)=> {
    // console.log("hey")
    personalInfo = req.body
    console.log(personalInfo)
    // console.log("gender is: " + personalInfo.dropdownMenuButon)
    updatedUser = {
        email: personalInfo.email,
        address: personalInfo.address,
        name: {
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            fullName: `${personalInfo.firstName} ${personalInfo.lastName}`
        },
        phoneNumber: personalInfo.phoneNumber,
        aboutMe: personalInfo.aboutMe,
        gender: personalInfo.dropdownMenuButton,
        dob: personalInfo.dateOfBirth,
        websiteUrl: personalInfo.websiteUrl
        // resumeUrl: `/public/uploads/employeeFiles/resume/${personalInfo.resumeUrl}`,  
    }
    console.log(personalInfo.userid)
    try{
        const newUser = await user.updateUser(personalInfo.userid, updatedUser)
        console.log(newUser)
    }catch(e){
        console.log(e)
    }
    
    res.redirect('/profile')
  });

router.get('/create', async(req,res)=>{
    console.log(req.session.currentUser)
    let user ={
        username : req.session.username,
        email : req.session.email
    }
    if(req.session.currentUser == 'employee'){
        res.render('employee/employeeInfo', { title: "Employee Details" , employee:user, auth: true, notLoginPage: true});
    }
    else{
        res.render('company/companyInfo', { title: "Company Details" , company: user, auth: true, notLoginPage: true});
    }
});

router.post('/deleteResume', async(req,res)=>{
    console.log("Reached Delete Resume")
    console.log(req.body.resumeid)
    console.log(req.session._id)
    try{
        await resume.removeResume(req.body.resumeid,req.session._id)
    } catch(e){
        console.log(e)
    }
    res.redirect('/profile')
});

router.post('/deleteJob', async(req,res)=>
{    
    let companyId = req.body.companyid;
    let jobId = req.body.jobid;
    try{
        await jobs.removeJob(jobId, companyId);
    }catch(e){
        console.log(e)
    }
    
    res.redirect('/profile');
});

router.post('/addResume', async(req,res)=>{
    console.log(req.body)
    let education= []
    const workDes = req.body.workDes
    const school = req.body.School
    const project = req.body.project
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
  const newResume = await resume.addResume(education,skills,'',`CS_546_group23_final_project/public/uploads/employeeImages/resume/`,req.body.resume.workStatus,req.body.resume.year,true)

// Add project
if(req.body.project) {
  if(project != null && Array.isArray(project.projectTitle)){
    for(i = 0; i < (project.projectTitle).length; i++)
    {
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
    const addResumeToUser = await user.addResumeToUser(req.session._id,newResume)
} catch(e){
    console.log(e)
}

  

  // Add Work Description
//   if(req.body.workDes) {
//     if(workDes != null && Array.isArray(workDes.companyName)){
//       for(i = 0; i < (workDes.companyName).length; i++){
//         const newWorkExperience = await workExperience.addWorkDesc(workDes.companyName[i],workDes.jobTitle[i],workDes.WorkDescription[i],workDes.workStartDate[i],workDes.workEndDate[i]);
//         const addWorkDesToUser = await user.addWorkDesToUser(req.session._id, newWorkExperience);
//       }
//       }
//       else{
//         const newWorkExperience = await workExperience.addWorkDesc(workDes.companyName,workDes.jobTitle,workDes.WorkDescription,workDes.workStartDate,workDes.workEndDate);
//         const addWorkDesToUser = await user.addWorkDesToUser(req.session._id, newWorkExperience);
//       }
//   }

  
  // console.log(newUser)
  
  res.redirect('/profile')
})

module.exports = router;
