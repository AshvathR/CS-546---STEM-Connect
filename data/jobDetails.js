const mongoCollections = require('../config/mongoCollections');
const jobDetails = mongoCollections.jobDetails;
const users = require('./users');
const objectId = require('mongodb').ObjectID;

function checkUndef(variable, variableName)
{
    if (variable === null || variable === undefined)
    {
        throw `${variableName || 'Provided Variable'} is not defined!`
    }
}

let exportedMethods = {

    async addJobDetials(jobTitle, jobLocation, jobDescription, jobCategory, salaryMin, salaryMax, qualifications) {

        const jobCollection = await jobDetails();
    
        const newJob = {
          jobTitle: jobTitle,//array_of_objects
          jobLocation: jobLocation,//array_of_objects,sub document
          jobDescription:jobDescription,//array_of_object,sub document
          jobCategory: jobCategory,
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
    },

    async getAllJobs()
    {
      const jobCollection = await jobDetails();
      const jobList = await jobCollection.find({}).toArray();
      if (!jobList) throw `No jobs found!`;
      return jobList;
    },

    async getJobById (id)
    {
      checkUndef(id, "id");

      const jobCollection = await jobDetails();
      const job = await jobCollection.findOne({ _id: objectId(id) });
      if (!job) throw `Job with the given ID: ${id} not found!`;
      return job;
    },

    async removeJob(id)
    {
      checkUndef(id, "id");

      const jobCollection = await jobDetails();
      const deletionInfo = await jobCollection.removeOne({ _id: objectId(id)} );

      if (deletionInfo.deletedCount == 0)
      {
        throw `Could not delete job with id of ${id}`;
      }

      return true;
    },

    async updateJob(id, updatedJob)
    {
      checkUndef(id, "id");
      checkUndef(updatedJob, "updatedJob");

      const job = await this.getJobById(id);

      let jobUpdateInfo = 
      {
        jobName: updatedJob.jobName,
        jobLocation: updatedJob.jobLocation,
        jobDescription: updatedJob.jobDescription,
        jobCategory: updatedJob.jobCategory,
        salaryMin: updatedJob.salaryMin,
        salaryMax: updatedJob.salaryMax,
        qualifications: updatedJob.qualifications
      }

      const jobCollection = await jobDetails();
      const updateInfo = await jobCollection.updateOne({ _id: objectId(id) }, { $set: jobUpdateInfo});

      if(!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Update Faield!`;

      return await this.getJobById(id);
    }


}

module.exports = exportedMethods