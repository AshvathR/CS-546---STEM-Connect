const mongoCollections = require('../config/mongoCollections');
const jobDetails = mongoCollections.jobDetails;
const users = require('./users');
const objectId = require('mongodb').ObjectID;
const company = mongoCollections.company;
const companyFunc = require('./company')

function checkUndef(variable, variableName)
{
    if (variable === null || variable === undefined)
    {
        throw `${variableName || 'Provided Variable'} is not defined!`
    }
}

let exportedMethods = {

  
    async addJob ({jobTitle, jobLocation, jobDescription, jobCategory, salaryMin, salaryMax, qualifications, yearsOfExperience, skills,jobStatus}) {


        const jobCollection = await jobDetails();
    
        const newJob = {
          jobTitle: jobTitle,//array_of_objects
          jobLocation: jobLocation,//array_of_objects,sub document
          jobDescription:jobDescription,//array_of_object,sub document
          yearsOfExperience:yearsOfExperience,
          skills: skills,
          jobCategory: jobCategory,
          salaryMin: salaryMin,
          salaryMax: salaryMax,
          qualifications: qualifications,
          jobStatus:jobStatus
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
    async searchJobByYearSkills(years,skillsArray)
    {
      checkUndef(years, "years");
      checkUndef(skillsArray,"skillsArray");
      const jobCollection = await jobDetails();
      console.log(years);
      const jobsList = await jobCollection.find({$and: [{jobStatus: true},{ yearsOfExperience: { $lte: parseInt(years)} }, { skills: { $in: skillsArray}}]}).toArray();
      // console.log(jobsList)
      return jobsList
    },

    async updateJob(id, updatedJob,companyId)
    {
      checkUndef(id, "id");
      checkUndef(updatedJob, "updatedJob");
      checkUndef(companyId, "companyId")

      const job = await this.getJobById(id);

      let jobUpdateInfo = 
      {
        jobTitle: updatedJob.jobTitle,
        jobLocation: updatedJob.jobLocation,
        jobDescription: updatedJob.jobDescription,
        yearsOfExperience:updatedJob.yearsOfExperience,
        skills:updatedJob.skills,
        jobCategory: updatedJob.jobCategory,
        salaryMin: updatedJob.salaryMin,
        salaryMax: updatedJob.salaryMax,
        qualifications: updatedJob.qualifications,
        jobStatus: updatedJob.jobStatus
      }

      const jobCollection = await jobDetails();
      const updateInfo = await jobCollection.updateOne({ _id: objectId(id) }, { $set: jobUpdateInfo });

      if(!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Update Field!`;
      // Update job in company doc
      const companyCollection = await company();

      const updateJob = await companyCollection.updateOne({
        _id : objectId(companyId),
        "jobDetails._id" : objectId(id)
      },{
        $set: {
          "jobDetails.$.jobTitle" : updatedJob.jobTitle,
          "jobDetails.$.jobLocation": updatedJob.jobLocation,
          "jobDetails.$.jobDescription": updatedJob.jobDescription,
          "jobDetails.$.jobCategory": updatedJob.jobCategory,
          "jobDetails.$.salaryMin": updatedJob.salaryMin,
          "jobDetails.$.salaryMax": updatedJob.salaryMax,
          "jobDetails.$.qualifications": updatedJob.qualifications
        }
      }, false, true);

      return await this.getJobById(id);
    }
}

module.exports = exportedMethods