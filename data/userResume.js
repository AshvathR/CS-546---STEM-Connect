// const { users } = require('../config/mongoCollections');
const mongoCollections = require('../config/mongoCollections');
const userResume = mongoCollections.userResume;
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

    async addResume(education, skills, description, userResumeUrl, workStatus, resumeActive)
    {
        const resumeCollection = await userResume();
        const newResume = {
          education: education,//array_of_objects
          workExperience: [],//array_of_objects,sub document
          projects: [],//array_of_object,sub document
          skills: skills,//array_of_skills
          workStatus:workStatus,
          description:description,
          resumeActive:resumeActive,
          userResumeUrl:userResumeUrl
        };
        // userId = mongodb.ObjectId(userId)
    
        const newInsertInformation = await resumeCollection.insertOne(newResume);
        const newId = newInsertInformation.insertedId;
        console.log(newId);
        console.log(newResume);
        
        
        await users.addResumeToUser(newId, newResume);
        console.log("Added Resume");

        return await this.getResumeById(newId);
    },

    async getResumeById(id)
    {
      checkUndef(id, "id");

      const resumeCollection = await userResume();
      const resume = await resumeCollection.findOne({ _id: objectId(id) });

      if (!resume) throw `Resume with the given ID: ${id} not found!`;
      return resume;
    },

    async removeResume(id)
    {
      const resumeCollection = await userResume();
      let resume = null;

      try
      {
        resume = await this.getResumeById(id);
      }
      catch(e)
      {
        console.log(e);
        return;
      }

      let temp = resume._id;

      const deletionInfo = await resumeCollection.removeOne({ _id: objectId(id) });
      if (deletionInfo.deletedCount == 0) throw `Could not delete resume with the ID of ${id}`;

      await users.removeResumeFromUser(temp)
      obj = {"resumeId": temp, "deleted": true};
      return obj;
    },

    async getAllResumes()
    {
      const resumeCollection = await userResume()
      const resumeList = await resumeCollection.find({}).toArray();

      if (!resumeList) throw `No resumes found!`;
      return resumeList;
    },
}

module.exports = exportedMethods