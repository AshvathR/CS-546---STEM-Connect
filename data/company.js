const mongoCollections = require('../config/mongoCollections');
const company = mongoCollections.company;
const jobDetails = require('./jobDetails')
const objectId = require("mongodb").ObjectID;

function checkUndef(variable, variableName)
{
    if (variable === null || variable === undefined)
    {
        throw `${variableName || 'Provided Variable'} is not defined!`
    }
}

let exportedMethods = {
  async addCompany(companyName, location, category, hrEmail, username, hashedPassword) {

        const companyCollection = await company();
    
        const newCompany = {
          companyName: companyName,//array_of_objects
          location: location,//array_of_objects,sub document
          category:category,//array_of_object,sub document
          hrEmail: hrEmail,//array_of_skills
          jobDetails:[],
          username: username,
          hashedPassword: hashedPassword
        };
    
        const newInsertInformation = await companyCollection.insertOne(newCompany);
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

      const companyCollection = await company();
      const selectedCompany = await companyCollection.findOne({ _id: objectId(id) });
      if (!selectedCompany) throw `Company with the given ID: ${id} not found`;
      return selectedCompany;
    },

    async getPartialNameMatch(partialName){
      if(!partialName || partialName.length  < 5) throw 'Invalid Lookup';
      const userCollection = await company();
      let match = new RegExp('^' + partialName);
      const partialMatchList = await userCollection.find({ companyName: match}, {projection: {_id: 1, companyName: 1}}).toArray();
      return partialMatchList;
    },

    async removeCompany (id)
    {
      const companyCollection = await company();
      let company = null;

      try
      {
        company = await this.getCompanyById(id);
      }
      catch(e)
      {
        console.log(e);
        return;
      }

      const deletionInfo = await companyCollection.removeOne({ _id: objectId(id) });
      if (deletionInfo.deletedCount === 0)
      {
        throw `Could not delete the company with given ID: ${id}`;
      }
    },

    async addJobToCompany(companyId, newJob) {
      checkUndef(companyId, "companyId");
      checkUndef(newJob, "newJob");

      const companyCollection = await company();
  
      const updateInfo = await companyCollection.updateOne(
        { _id: companyId },
        { $addToSet: { jobDetails: newJob } }
      );
  
      if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update failed';
  
      return await this.getCompanyById(companyId);
    },

    async getAllUsername() {
      const companyCollection = await company();
      const companyList = await companyCollection.find({},{ projection: { _id: 1, username: 1}}).toArray();
      return companyList;
    },

    async checkExistingUsername(username){
      checkUndef(username, "username");
      const allUsername = await this.getAllUsername();
      for(let current of allUsername ){
        let currentUsername = current.username.toLowerCase();
        username = username.toLowerCase();
        if(currentUsername === username){
          return false;
        }
      }
      return true;
    },

    async checkUsernameandPassword(username, password){
      username = username.toLowerCase();
      let usernameExists = await this.checkExistingUsername(username);
      const allUsers = await this.getAllUsers();
      for(let current of allUsers ){
        let currentEmail = current.hrEmail.toLowerCase();
        if(currentEmail === username){
          usernameExists = true;
        }
      }
      if(!usernameExists){
        return false;
      } 
      for(let current of allUsers ){
        let currentEmail = current.hrEmail.toLowerCase();
        let currentUserName = current.username.toLowerCase();
        if(username === currentEmail || username === currentUserName){
          let checkPassword = await bcrypt.compare(password, current.hashedPassword);
          return checkPassword;
        }
      }
    },

    // async removeJobFromCompany(jobId)
    // {
    //   checkUndef(jobId);

    //   const companyCollection = await company();
    //   const company = await companyCollection.findOne({ jobDetails: { $elemMatch: { _id: jobId } } });
    //   let companyId = company._id;

    //   const updateInfo = await companyCollection.updateOne(
    //     { _id: companyId},
    //     { $pull: { jobDetails: { _id: jobId } } }
    //   );

    //   if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Update Failed!`;
    //   return await this.getCompanyById(companyId);
    // }
}

module.exports = exportedMethods