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

    async addJob (jobTitle, jobLocation, jobDescription, jobCategory, salaryMin, salaryMax, qualifications) {

        const jobCollection = await jobDetails();
    
        const newJob = {
          jobTitle: jobTitle,
          jobLocation: jobLocation,
          jobDescription:jobDescription,
          jobCategory: jobCategory,
          salaryMin: salaryMin,
          salaryMax: salaryMax,
          qualifications: qualifications
        };
    
        const newInsertInformation = await jobCollection.insertOne(newJob);
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

    async removeJob(jobId, companyId)
    {
      checkUndef(jobId, "jobId");

      const jobCollection = await jobDetails();
      let job = null;
      
      try
      {
        job = await this.getJobById(jobId);
      }
      catch (e)
      {
        console.log(e);
      }
      
      const deletionInfo = await jobCollection.removeOne({ _id: objectId(jobId)} );
      if (deletionInfo.deletedCount == 0)
        throw `Could not delete job with id of ${jobId}`;
      
      const companyCollection = await company();

      const jobRemove = await companyCollection.updateOne
      (
        {
          _id: companyId,
          "jobDetails._id": jobId
        },
        {
          $pull: { jobDetails: { _id: jobId } }
        }, false, true
      );

      return true;
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
        jobCategory: updatedJob.jobCategory,
        salaryMin: updatedJob.salaryMin,
        salaryMax: updatedJob.salaryMax,
        qualifications: updatedJob.qualifications
      }

      const jobCollection = await jobDetails();
      const updateInfo = await jobCollection.updateOne({ _id: objectId(id) }, { $set: jobUpdateInfo });

      if(!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Update Field!`;
      const companyCollection = await company()
      // Update job in company doc

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