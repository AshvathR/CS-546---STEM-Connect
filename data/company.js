const mongoCollections = require('../config/mongoCollections');
const company = mongoCollections.company;
const objectId = require("mongodb").ObjectID;

function checkUndef(variable, variableName)
{
    if (variable === null || variable === undefined)
    {
        throw `${variableName || 'Provided Variable'} is not defined!`
    }
}

let exportedMethods = {
  async addCompany(companyName, location, category, hrEmail) {

        const companyCollection = await company();
    
        const newCompany = {
          companyName: companyName,//array_of_objects
          location: location,//array_of_objects,sub document
          category:category,//array_of_object,sub document
          hrEmail: hrEmail,//array_of_skills
          jobDetails:[]
        };
        // userId = mongodb.ObjectId(userId)
    
        const newInsertInformation = await companyCollection.insertOne(newCompany);
        // const newId = newInsertInformation.insertedId;
        // await users.addResumeToUser(userId, newResume);
        console.log("Added newCompany")
        return newCompany;
    },

    async getAllCompanies()
    {
      const companyCollection = await company();
      return await companyCollection.find({}).toArray();
    },

    async getCompanyById(id)
    {
      checkUndef(id, "id");
      // console.log("reached")
      const companyCollection = await company();
      const selectedCompany = await companyCollection.findOne({ _id: objectId(id) });
      if (!selectedCompany) throw `Company with the given ID: ${id} not found`;
      return selectedCompany;
    },

    async removeCompany (id)
    {
      const companyCollection = await company();
      let company = null;

      try
      {
        review = await this.getCompanyById(id);
      }
      catch(e)
      {
        console.log(e);
        return;
      }

      // let temp = company._id;

      const deletionInfo = await companyCollection.removeOne({ _id: objectId(id) });
      if (deletionInfo.deletedCount === 0)
      {
        throw `Could not delete the company with given ID: ${id}`;
      }
    },

    async addJobToCompany(companyId, newJob) {
      checkUndef(companyId, "companyId");
      checkUndef(newJob, "newJob");
      
      // let currentJob = await userRes.getResumeById(companyId._id);
      const companyCollection = await company();
      // const resumeCollection = await userResume();
  
      const updateInfo = await companyCollection.updateOne(
        { _id: companyId },
        { $addToSet: { jobDetails: newJob } }
      );
  
      if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update failed';
  
      return await this.getCompanyById(companyId);
    },
}

module.exports = exportedMethods