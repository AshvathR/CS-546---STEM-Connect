const { jobDetails, users } = require('../config/mongoCollections');
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const loginInfo = data.loginInfo;
const userResume = data.userResume;
const usersData = data.users;
const workExperience = data.workExperience;
const Resume = data.userResume;
const project = data.projects;
const companyFunc = data.company;
const job = data.jobDetails;


async function main() 
{
  try{
  const db = await dbConnection();
  await db.dropDatabase();

  try {
    //Add company
    const newCompany = await companyFunc.addCompany('Essential Tech', 'Mumbai','IT','hrMail@mail.com', 'mumbaiUser', '$2b$16$XoxM9a/lLskO6Fx5wSpvauSwvGip7XexMvliIQiDSHHtElYEP3n3O');
    const newCompany1 = await companyFunc.addCompany('Marlboro', 'Dubai','Distribution','drane@stevens.com', 'smokerMan', '$2b$16$XoxM9a/lLskO6Fx5wSpvauSwvGip7XexMvliIQiDSHHtElYEP3n3O');
    //Add job
    const newJob = await job.addJob('Front End Dev', 'Mumbai','working on the ui',4,['Mongob', 'Nodejs'],'IT','55$','85$','Text on Qualifications',true)
    const newJob1 = await job.addJob('Back End Dev', 'Banglore','Working on the Data Functions',2,["Java",'Mongob', 'Nodejs'],'IT','50$','83$','Text on Qualifications',true)

    const newJob2 = await job.addJob('Front End Dev', 'Mumbai','working on the ui',4,['Mongob', 'Nodejs'],'IT','55$','85$','Text on Qualifications',true)
    const newJob3 = await job.addJob('Back End Dev', 'Banglore','Working on the Data Functions',2,["Java",'Mongob', 'Nodejs'],'IT','50$','83$','Text on Qualifications',true)

    //Add job to company
    const addJobToCompany = await companyFunc.addJobToCompany(newCompany._id, newJob);
    const addJobToCompany1 = await companyFunc.addJobToCompany(newCompany._id, newJob1);

    const addJobToCompany2 = await companyFunc.addJobToCompany(newCompany1._id, newJob2);
    const addJobToCompany3 = await companyFunc.addJobToCompany(newCompany1._id, newJob3);
    // tempJob = {
    //   "jobTitle": "Back End Dev ",
    //   "jobLocation": "Banglore",
    //   "jobDescription": "working on the DF",
    //   "yearsOfExperience": 2,
    //   "skills": ['Mongob', 'Nodejs'],
    //   "jobCategory": "IT",
    //   "salaryMin": "35$",
    //   "salaryMax": "65$",
    //   "qualifications": "Text on Qualifications",
    //   "jobStatus": true
    // }
    // //Update Job
    try{
      const removeJob = await job.removeJob(newJob1._id);
      console.log(removeJob);
    }catch(e){
      console.log (e);
    }
  }catch(e){
    console.log (e);
  }
  // try {
  //   await job.addJob('Front End Dev', 'Mumbai','working on the ui','IT','35$','65$','Text on Qualifications')
  // }catch(e){
  //   console.log (e);
  // }

  // try {
  //   await project.addProject('Customer Analytics', 'description on the project','04/03/2020','04/03/2020')
  // }catch(e){
  //   console.log (e);
  // }

  // try {
  //   // const account = await loginInfo.addAccount('SHUBHAMWARGHADE','qwertyuiop')
  //   // console.log(loginInfo)
  //   // const id = account._id;
  //   // ( profilePictureUrl, email,address, firstName, lastName, phoneNumber, aboutMe, gender, dob, resumeUrl)
  //   await usersData.addUser('asada.jpeg','shubham@shubham.shubham',' 123 address, deep, NYC', 'Shubham', 'Warghade', '123456789', 'I am batman!','M','05/07/1997','https:/')
  // }catch(e){
  //   console.log (e);
  // }

  try {
    //Add user
    const newUser = await usersData.addUser('asada.jpeg','shubham@shubham.shubham',' 123 address, deep, NYC', 'Shubham', 'Warghade', '123456789', 'I am batman!','M','05/07/1997','https:/','shubham', '$2b$16$XoxM9a/lLskO6Fx5wSpvauSwvGip7XexMvliIQiDSHHtElYEP3n3O')//password - '123_Shubham' hashedpassword -'$2b$16$XoxM9a/lLskO6Fx5wSpvauSwvGip7XexMvliIQiDSHHtElYEP3n3O'
    const newUser1 = await usersData.addUser("whatever.jpeg", "deep@deep.com", "248 newyork ave NJ", "deep", "rane", "9876543210", "you know who i am", "m", "06/01/1997", "localhost:3000", "dsr", "$2b$16$XoxM9a/lLskO6Fx5wSpvauSwvGip7XexMvliIQiDSHHtElYEP3n3O");
    
    //Add Resume                                                                                                                

    const resume =  await Resume.addResume([{schoolName:'Stevens Institute of Technology',startDate:'31/08/2020',endDate:'25/05/2022',gpa:4},{schoolName:'Mumbai University',startDate:'june 2016',endDate:'july 2019',gpa:'4'}],['web dev','Analytics','mongodb'],'hey this is my first resume','resume.pdf','Employed',2,true)
    const resume1 =  await Resume.addResume([{schoolName:'Stevens Institute of Technology',startDate:'31/08/2020',endDate:'25/05/2022',gpa:4},{schoolName:'Mumbai University',startDate:'june 2016',endDate:'july 2019',gpa:'4'}],['web dev','tableau','expressjs','reactjs'],'hey this is my second resume','resume.pdf','Employed',5,true)

    const resume2 =  await Resume.addResume([{schoolName:'Stevens Institute of Technology',startDate:'31/08/2020',endDate:'25/05/2022',gpa:4},{schoolName:'Mumbai University',startDate:'june 2016',endDate:'july 2019',gpa:'4'}],['web dev','Analytics','mongodb'],'hey this is my first resume','resume.pdf','Employed',2,true)
    const resume3 =  await Resume.addResume([{schoolName:'Stevens Institute of Technology',startDate:'31/08/2020',endDate:'25/05/2022',gpa:4},{schoolName:'Mumbai University',startDate:'june 2016',endDate:'july 2019',gpa:'4'}],['web dev','tableau','expressjs','reactjs'],'hey this is my second resume','resume.pdf','Employed',5,true)
    //Add Project
    const newProject =  await project.addProject('Customer Analytics', 'description on the project','04/03/2020','04/03/2020');
    const newProject1 = await project.addProject('Data Analytics', 'working on historical data','01/01/2019','07/30/2020');

    const newProject2 =  await project.addProject('Customer Analytics', 'description on the project','04/03/2020','04/03/2020');
    const newProject3 = await project.addProject('Data Analytics', 'working on historical data','01/01/2019','07/30/2020');

    const newProject4 =  await project.addProject('Customer Analytics', 'description on the project','04/03/2020','04/03/2020');
    const newProject5 = await project.addProject('Data Analytics', 'working on historical data','01/01/2019','07/30/2020');

    const newProject6 =  await project.addProject('Customer Analytics', 'description on the project','04/03/2020','04/03/2020');
    const newProject7 = await project.addProject('Data Analytics', 'working on historical data','01/01/2019','07/30/2020');
    // add project to resume
    const addProjectToUserResume = await userResume.addProjectToUserResume(resume._id,newProject);
    const addProjectToUserResume1 = await userResume.addProjectToUserResume(resume._id, newProject1);

    const addProjectToUserResume2 = await userResume.addProjectToUserResume(resume1._id,newProject2);
    const addProjectToUserResume3 = await userResume.addProjectToUserResume(resume1._id, newProject3);

    const addProjectToUserResum4 = await userResume.addProjectToUserResume(resume2._id,newProject4);
    const addProjectToUserResume5 = await userResume.addProjectToUserResume(resume2._id, newProject5);

    const addProjectToUserResume6 = await userResume.addProjectToUserResume(resume3._id,newProject6);
    const addProjectToUserResume7 = await userResume.addProjectToUserResume(resume3._id, newProject7);
    //Add Resume to user
    const addResumeToUser = await usersData.addResumeToUser(newUser._id,resume);
    const addResumeToUser1 = await usersData.addResumeToUser(newUser._id,resume1);

    const addResumeToUser2 = await usersData.addResumeToUser(newUser1._id,resume2);
    const addResumeToUser3 = await usersData.addResumeToUser(newUser1._id,resume3);
    // Add workExperience to user
    const newWorkExperience = await workExperience.addWorkDesc('TechName','web dev','jobDes','04/03/2020','19/11/2020');
    const newWorkExperience1 = await workExperience.addWorkDesc('ADP','Front End Developer','Implemented and tested solutions with Mocha/Chai and Cypress in a CI/CD Agile environment','06/01/2020','08/07/2020');

    const newWorkExperience2 = await workExperience.addWorkDesc('TechName','web dev','jobDes','04/03/2020','19/11/2020');
    const newWorkExperience3 = await workExperience.addWorkDesc('ADP','Front End Developer','Implemented and tested solutions with Mocha/Chai and Cypress in a CI/CD Agile environment','06/01/2020','08/07/2020');

    const newWorkExperience4 = await workExperience.addWorkDesc('TechName','web dev','jobDes','04/03/2020','19/11/2020');
    const newWorkExperience5 = await workExperience.addWorkDesc('ADP','Front End Developer','Implemented and tested solutions with Mocha/Chai and Cypress in a CI/CD Agile environment','06/01/2020','08/07/2020');

    const newWorkExperience6 = await workExperience.addWorkDesc('TechName','web dev','jobDes','04/03/2020','19/11/2020');
    const newWorkExperience7 = await workExperience.addWorkDesc('ADP','Front End Developer','Implemented and tested solutions with Mocha/Chai and Cypress in a CI/CD Agile environment','06/01/2020','08/07/2020');
    
    const addWorkDesToUser = await usersData.addWorkDesToUser(newUser._id, newWorkExperience);
    const addWorkDesToUser1 = await usersData.addWorkDesToUser( newUser._id, newWorkExperience1);

    const addWorkDesToUser2 = await usersData.addWorkDesToUser(newUser._id, newWorkExperience2);
    const addWorkDesToUser3 = await usersData.addWorkDesToUser( newUser._id, newWorkExperience3);

    const addWorkDesToUser4 = await usersData.addWorkDesToUser(newUser1._id, newWorkExperience4);
    const addWorkDesToUser5 = await usersData.addWorkDesToUser( newUser1._id, newWorkExperience5);

    const addWorkDesToUser6 = await usersData.addWorkDesToUser(newUser1._id, newWorkExperience6);
    const addWorkDesToUser7 = await usersData.addWorkDesToUser( newUser1._id, newWorkExperience7);

    // updating work description

    try {
      const removeResume = await userResume.removeResume(resume._id, newUser._id);
      console.log(removeResume);
    } catch (e) {
      console.log(e)
    }
    
    tempProject =
    {
      "projectTitle": "Essential Tech",
      "description": "Made an appointment SaaS",
      "startDate": "05/01/2020",
      "endDate": "07/31/2020"
    }

    //updating projects

    // try {
    //   const updateProject = await project.updateProject(newProject._id, resume._id, newUser._id, tempProject);
    // } catch (e) {
    //   console.log(e)
    // }
  }catch(e){
    console.log (e);
  }


  // try{
  //   const searchResumeByYearSkills = await userResume.searchResumeByYearSkills(2,['web dev'])
  //   // console.log(searchResumeByYearSkills)
  // } catch (e) {
  //   console.log(e)
  // }
  // try{
  //   const searchJobByYearSkills = await job.searchJobByYearSkills(2,['web dev'])
  //   // console.log(searchJobByYearSkills)
  // } catch (e) {
  //   console.log(e)
  // }
  // try{
  //   const usersList = await usersData.findUserByResumeId('6098b6718364680b743e7026')
  //   console.log(usersList)
  // } catch (e) {
  //   console.log(e)
  // }


  
  console.log('Done seeding database');

  await db.serverConfig.close();
  } catch(e){
    console.log(e);
  }

}

main();