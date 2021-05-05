const mongoCollections = require('../config/mongoCollections');
const jobDetails = mongoCollections.jobDetails;
const users = require('./users')

let exportedMethods = {

    async addJobDetials(jobTitle, jobLocation, jobDescription, jobCategory, salaryMin, salaryMax, qualifications) {

        const jobCollection = await jobDetails();
    
        const newJob = {
          jobTitle: jobTitle,//array_of_objects
          jobLocation: jobLocation,//array_of_objects,sub document
          jobDescription:jobDescription,//array_of_object,sub document
          jobCategory: jobCategory,//array_of_skills
          salaryMin: salaryMin,
          salaryMax: salaryMax,
          qualifications: qualifications
        };
        // userId = mongodb.ObjectId(userId)
    
        const newInsertInformation = await jobCollection.insertOne(newJob);
        // const newId = newInsertInformation.insertedId;
        // await users.addResumeToUser(userId, newResume);
        console.log("Added newJob")
        return newJob
    }


}

module.exports = exportedMethods