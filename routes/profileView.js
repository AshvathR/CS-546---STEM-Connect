const express = require('express');
const router = express.Router();
const data = require('../data/');
const { updateUser } = require('../data/users');
// var flash = require('connect-flash');
const user = data.users
const resume = data.userResume
const company = data.company
router.get('/', async(req,res)=> {
    // console.log(req.session)
    // req.flash('userId', req.session._id)
    if (req.session.currentUser == 'employee') {
        const userInfo = await user.getUserById(req.session._id)
        // console.log(userInfo)
        res.render('employee/profile', { title: "Company Details" , user : userInfo ,  auth: true, notLoginPage: true});
    } else {
        const companyInfo = await company.getCompanyById(req.session._id)
        // console.log(companyInfo)
        res.render('company/profile', { title: "Company Details" , company : companyInfo,  auth: true, notLoginPage: true});
    }
})

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

})

router.post('/editPersonalInfo', async (req,res)=> {
    console.log("hey")
    personalInfo = req.body
    console.log(personalInfo)
    console.log("gender is: " + personalInfo.dropdownMenuButon)
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
