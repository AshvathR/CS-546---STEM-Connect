const mongoCollections = require('../config/mongoCollections');
const workExperience = mongoCollections.workExperience;
const userRes = require('./userResume')

let exportedMethods = {

    async addWorkDescription(companyName, jobTitle, jobDescription,startDate, endDate) {
        const workExperienceCollection = await workExperience();
    
        let newWork = {
          companyName : companyName,
          jobTitle: jobTitle,
          jobDescription:jobDescription,
          startDate:startDate,
          endDate: endDate
           
        };
        // jobExperienceId = mongodb.ObjectId(jobExperienceId)
    
        const newInsertInformation = await workExperienceCollection.insertOne(newWork);
        // const newId = newInsertInformation.insertedId;
        // await loginInfo.addUserToAccount(jobExperienceId, newJob);
        console.log("Added workExperience")
        return newWork
        // return await thusis.getResumeById(newId);
      },


}

module.exports = exportedMethods