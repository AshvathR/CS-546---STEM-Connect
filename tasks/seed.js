const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const loginInfo = data.loginInfo;
const userResume = data.userResume;
const users = data.users;
const workExperience = data.workExperience;
const Resume = data.userResume;
const project = data.projects;
const company = data.company;
const job = data.jobDetails;

async function main() 
{
  const db = await dbConnection();
  await db.dropDatabase();

  try {
    //Add company
    newCompany = await company.addCompany('Essential Tech', 'Mumbai','IT','hrMail@mail.com')
    //Add job
    newJob = await job.addJob('Front End Dev', 'Mumbai','working on the ui','IT','35$','65$','Text on Qualifications')
    //Add job to company
    const addJobToCompany = await company.addJobToCompany(newCompany._id,newJob)
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
  //   await users.addUser('asada.jpeg','shubham@shubham.shubham',' 123 address, deep, NYC', 'Shubham', 'Warghade', '123456789', 'I am batman!','M','05/07/1997','https:/')
  // }catch(e){
  //   console.log (e);
  // }

  try {
    //Add user
    const newUser = await users.addUser('asada.jpeg','shubham@shubham.shubham',' 123 address, deep, NYC', 'Shubham', 'Warghade', '123456789', 'I am batman!','M','05/07/1997','https:/')
    //Add Resume
    const resume =  await Resume.addResume([['SchoolName','startDate','endDate','gpa'],['SchoolName2','startDate','endDate','gpa']],['web dev','Analytics'],'hey this is my first resume','resume.pdf','Employed','yes')
    //Add Project to resume
    const newProject =  await project.addProject('Customer Analytics', 'description on the project','04/03/2020','04/03/2020')
    const addProjectToUserResume = await userResume.addProjectToUserResume(resume._id,newProject)
    //Add Resume to user
    const addResumeToUser = await users.addResumeToUser(newUser._id,resume)
    // Add workExperience to user
    const newWorkExperience = await workExperience.addWorkDescription('TechName','web dev','jobDes','04/03/2020','19/11/2020')
    const addWorkDesToUser = await users.addWorkDesToUser(newUser._id,newWorkExperience)
    
    // console.log(newUser._id)
    
    
  }catch(e){
    console.log (e);
  }

  // try {
  //   // (companyName, jobTitle, jobDescription,startDate, endDate)
  //     await workExperience.addWorkDescription('TechName','web dev','jobDes','04/03/2020','19/11/2020')
  //   }catch(e){
  //     console.log (e);
  //   }

  
  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();