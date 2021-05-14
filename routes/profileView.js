const express = require('express');
const router = express.Router();
const data = require('../data/');
const { updateUser } = require('../data/users');
const user = data.users
const resume = data.userResume
const companyFunc = data.company
const jobs = data.jobDetails;

router.get('/', async(req,res)=> {
    // console.log(req.session)
    // req.flash('userId', req.session._id)
    if (req.session.currentUser == 'employee') {
        const userInfo = await user.getUserById(req.session._id)
        // console.log(userInfo)
        res.render('employee/profile', { title: "User Details" , user : userInfo ,  auth: true, notLoginPage: true, username: req.session.username});
    } else {
        const companyInfo = await companyFunc.getCompanyById(req.session._id);
        
        // console.log(companyInfo)
        res.render('company/profile', { title: "Company Details" , company : companyInfo,  auth: true, notLoginPage: true, username: req.session.username});
    }
});

router.get('/user/:id', async(req,res)=> {
    //if(req.session._id == req.params.id) res.redirect('/');
    const userInfo = await user.getUserById(req.params.id);
    // console.log(userInfo)
    res.render('employee/profile', { title: "Company Details" , user : userInfo ,  auth: req.session.authenticated, notLoginPage: true, username: req.session.username});

});

router.get('/company/:id', async(req,res)=> {
    //if(req.session._id == req.params.id) res.redirect('/');
    const companyInfo = await companyFunc.getCompanyById(req.params.id);
    // let x = (companyInfo.jobDetails.skills).length;
    // console.log(x);
    // console.log(companyInfo)
    res.render('company/profile', { title: "Company Details" , company : companyInfo,  auth: req.session.authenticated, notLoginPage: true, username: req.session.username}); 
});

router.post("/editJob", async (req, res) => 
{
    let jobInfo = req.body.jobDetails;
    // console.log(jobInfo.jobStatus);
    let companyId = jobInfo.companyId;
    let jobId = jobInfo.id;
    let skills = (jobInfo.skills).split(",");
    skills = skills.join();

    if (jobInfo.jobStatus == null) {
        jobInfo.jobStatus = false;
    } else if(jobInfo.jobStatus == "true") {
        jobInfo.jobStatus = true;
    }else if(jobInfo.jobStatus == "false") {
        jobInfo.jobStatus = false;
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

    const newJob = await jobs.updateJob(jobId, jobUpdateInfo, companyId);
    // console.log(newJob);
    res.redirect("/profile");
});

router.post('/editResume', async (req,res)=> {
    // let userId = req.flash('userId')
    userId = req.body.resume.userid
    resId = req.body.resume.id
    console.log((req.body.resume.School.schoolName).length)
    console.log(JSON.stringify(req.body.resume))

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
    console.log(req.body.resume.project)
    console.log(req.body.resume.project.projectTitle)
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
    }
    // console.log(temp)
    project.push(temp)

    const skills = (req.body.resume.skills).split(',')
    // console.log(temp)
    // console.log(project)

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
      console.log(resumeUpdateInfo)
      console.log(resId + ' ' + userId)
      try{
        const newUser = await resume.updateResume(resId, userId, resumeUpdateInfo)
        console.log(newUser)
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
    // console.log(personalInfo)
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
        resumeUrl: personalInfo.resumeUrl,  
    }

    const newUser = await user.updateUser(personalInfo.userid, updatedUser)
    console.log(newUser)
    res.redirect('/profile')
    // finduser = null
    // for (i = 0; i < userData.length; i++){
    //   if (req.body.username == userData[i].username){
    //     finduser = userData[i]
    //     break
    //   }
    // }
    // temp = false
    // if (finduser !== null) {
    //   temp = await bcrypt.compare(req.body.password,finduser.hashedPassword)
    //   if (temp == true) {
    //     req.session.user = req.body.username;
    //   }
    //   if (temp == false)
    //   {
    //     res.status(401).render("login", {error: " Invalid Entry of Username and Password"})
    //   }
    // } else {
    //   res.status(401).render("login", {error: " Invalid Entry of Username and Password"})
    // }
  });

router.get('/create', async(req,res)=>{
    console.log(req.session.currentUser)
    if(req.session.currentUser == 'employee'){
        res.render('employee/employeeInfo', { title: "Employee Details" , auth: true, notLoginPage: true});
    }
    else{
        res.render('company/companyInfo', { title: "Company Details" , auth: true, notLoginPage: true});
    }
})

module.exports = router;
