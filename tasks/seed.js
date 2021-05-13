const { jobDetails, users } = require('../config/mongoCollections');
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const loginInfo = data.loginInfo;
const userResume = data.userResume;
const usersData = data.users;
const workExperience = data.workExperience;
const Resume = data.userResume;
const project = data.projects;
const company = data.company;
const job = data.jobDetails;


async function main() 
{
  try{
  const db = await dbConnection();
  await db.dropDatabase();

  try {
    //Add company
    newCompany = await company.addCompany('Essential Tech', 'Mumbai','IT','hrMail@mail.com', 'mumbaiUser', '$2b$16$XoxM9a/lLskO6Fx5wSpvauSwvGip7XexMvliIQiDSHHtElYEP3n3O')
    //Add job
    newJob = await job.addJob('Front End Dev', 'Mumbai','working on the ui','IT','35$','65$','Text on Qualifications')
    newJob1 = await job.addJob("Back End Dec", "Bangalore", "Working on the Data Functions", "Software Development", "$55", "$85", "Masters in Computer Science");
    //Add job to company
    const newJobToCompany = await company.addJobToCompany(newCompany._id, newJob);
    const newJobToCompany1 = await company.addJobToCompany(newCompany._id, newJob1);
    // //Remove Job
    // try
    // {
    //   // remove job in job sub doc
    //   const removedJob = await job.removeJob(newJob1._id, newCompany._id);
    //   console.log(removedJob);
    // }
    // catch(e)
    // {
    //   console.log (e);
    // }
  }
  catch(e)
  {
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
    const newUser = await usersData.addUser('asada.jpeg','shubham@shubham.shubham',' 123 address, deep, NYC', 'Shubham', 'Warghade', '123456789', 'I am batman!','M','05/07/1997','https:/',
           'shubham', '$2b$16$XoxM9a/lLskO6Fx5wSpvauSwvGip7XexMvliIQiDSHHtElYEP3n3O')//password - '123_Shubham' hashedpassword -'$2b$16$XoxM9a/lLskO6Fx5wSpvauSwvGip7XexMvliIQiDSHHtElYEP3n3O'
    //Add Resume
    const resume =  await Resume.addResume([{schoolName:'Stevens Institute of Technology',startDate:'31/08/2020',endDate:'25/05/2022',gpa:4},{schoolName:'Mumbai University',startDate:'june 2016',endDate:'july 2019',gpa:'4'}],['web dev','Analytics','mongodb'],'hey this is my first resume','resume.pdf','Employed',2,true)
    const resume2 =  await Resume.addResume([{schoolName:'Stevens Institute of Technology',startDate:'31/08/2020',endDate:'25/05/2022',gpa:4},{schoolName:'Mumbai University',startDate:'june 2016',endDate:'july 2019',gpa:'4'}],['web dev','tableau','expressjs','reactjs'],'hey this is my second resume','resume.pdf','Employed',5,true)
    //Add Project to resume
    const newProject =  await project.addProject('Customer Analytics', 'description on the project','04/03/2020','04/03/2020')
    const addProjectToUserResume = await userResume.addProjectToUserResume(resume._id,newProject)
    //Add Resume to user
    const addResumeToUser = await usersData.addResumeToUser(newUser._id,resume)
    const addResume2ToUser = await usersData.addResumeToUser(newUser._id,resume2)
    // Add workExperience to user
    const newWorkExperience = await workExperience.addWorkDesc('TechName','web dev','jobDes','04/03/2020','19/11/2020');
    const newWorkExperience1 = await workExperience.addWorkDesc('ADP','Front End Developer','Implemented and tested solutions with Mocha/Chai and Cypress in a CI/CD Agile environment','06/01/2020','08/07/2020');
    const addWorkDesToUser = await users.addWorkDesToUser(newUser._id, newWorkExperience);
    const addWorkDesToUser1 = await users.addWorkDesToUser( newUser._id, newWorkExperience1);

    // updating work description

    try {
      const removeWorkDesc = await workExperience.removeWorkDesc(newWorkExperience1._id, newUser._id);
      console.log(removeWorkDesc);
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

    try {
      const updateProject = await project.updateProject(newProject._id, resume._id, newUser._id, tempProject);
    } catch (e) {
      console.log(e)
    }
  }catch(e){
    console.log (e);
  }

  try{
    const searchResumeByYearSkills = await userResume.searchResumeByYearSkills(2,['web dev'])
    // console.log(searchResumeByYearSkills)
  } catch (e) {
    console.log(e)
  }
  try{
    const searchJobByYearSkills = await job.searchJobByYearSkills(2,['web dev'])
    // console.log(searchJobByYearSkills)
  } catch (e) {
    console.log(e)
  }
  try{
    const usersList = await usersData.findUserByResumeId('6098b6718364680b743e7026')
    console.log(usersList)
  } catch (e) {
    console.log(e)
  }

  
  console.log('Done seeding database');

  await db.serverConfig.close();
  } catch(e){
    console.log(e);
  }

}

main();