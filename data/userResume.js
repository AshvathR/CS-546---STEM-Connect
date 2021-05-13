const mongoCollections = require('../config/mongoCollections');
const users= mongoCollections.users;
const userResume = mongoCollections.userResume;
const usersFunc = require('./users');
const objectId = require('mongodb').ObjectID;

function checkUndef(variable, variableName)
{
    if (variable === null || variable === undefined)
    {
        throw `${variableName || 'Provided Variable'} is not defined!`
    }
}

let exportedMethods = {

  
    async addResume(education, skills, description, userResumeUrl, workStatus,yearsOfExperience, resumeActive) {


        const resumeCollection = await userResume();
    
        const newResume = {
          education: education,
          // workExperience: [],//array_of_objects,sub document (Removed Because wrong Cardinality)
          projects: [],
          skills: skills,
          workStatus: workStatus,
          description: description,
          resumeActive: resumeActive,
          userResumeUrl: userResumeUrl
        };
    
        const newInsertInformation = await resumeCollection.insertOne(newResume);
        console.log("Added Resume")
        return newResume
    },

    async addProjectToUserResume(resumeId, newProject) {
      checkUndef(resumeId, "resumeId");
      checkUndef(newProject, "newProject");
      
      const resumeCollection = await userResume();
  
      const updateInfo = await resumeCollection.updateOne(
        { _id: resumeId },
        { $addToSet: { projects: newProject } }
      );
  
      if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update failed';
  
      return await this.getResumeById(resumeId);
    },

    async getResumeById(id)
    {
      checkUndef(id, "id");

      const resumeCollection = await userResume();
      const resume = await resumeCollection.findOne({ _id: objectId(id) });

      if (!resume) throw `Resume with the given ID: ${id} not found!`;
      return resume;
    },

    async removeResume(resumeId, userId)
    {
      checkUndef(resumeId, 'resumeId');
      checkUndef(userId, 'userId');
      
      const resumeCollection = await userResume();
      let resume = null;

      try
      {
        resume = await this.getResumeById(resumeId);
      }
      catch(e)
      {
        console.log(e);
        return;
      }

      const deletionInfo = await resumeCollection.removeOne({ _id: objectId(resumeId) });
      if (deletionInfo.deletedCount == 0) throw `Could not delete resume with the ID of ${resumeId}`;

      const userCollection = await users();

      const resumeRemove = await userCollection.updateOne(
        {
          _id: userId,
          "resume._id": resumeId
        },
        {
          $pull: { resume: { _id: resumeId } }
        }, false, true
      );
      
      return true;
    },

    async getAllResumes()
    {
      const resumeCollection = await userResume()
      const resumeList = await resumeCollection.find({}).toArray();

      if (!resumeList) throw `No resumes found!`;
      return resumeList;
    },

    async updateResume(resumeId, userId, updatedResume)
    {
      checkUndef(resumeId, "resumeId");
      checkUndef(userId, "userId");
      checkUndef(updatedResume, "updatedResume");

      const resume = await this.getResumeById(resumeId);

      let resumeUpdateInfo =
      {
        education: updatedResume.education,
        projects: updatedResume.projects,
        skills: updatedResume.skills,
        workStatus: updatedResume.workStatus,
        description: updatedResume.description,
        resumeActive: updatedResume.resumeActive,
        userResumeUrl: updatedResume.userResumeUrl
      }

      const resumeCollection = await userResume();
      const updateInfo = resumeCollection.updateOne( { _id: objectId(resumeId) }, { $set: resumeUpdateInfo } );

      if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Update Failed!`

      const userCollection = await users();

      const resumeUpdate = await userCollection.updateOne
      (
        {
          _id: userId,
          "resume._id": resumeId
        },
        {
          $set:
          {
            "resume.$.education": updatedResume.education,
            "resume.$.projects": updatedResume.projects,
            "resume.$.skills": updatedResume.skills,
            "resume.$.workStatus": updatedResume.workStatus,
            "resume.$.description": updatedResume.description,
            "resume.$.resumeActive": updatedResume.resumeActive,
            "resume.$.userResumeUrl": updatedResume.userResumeUrl
          }
        }, false, true
      );

      return await this.getResumeById(resumeId);
    },
    
    async searchResumeByYearSkills(years,skillsArray)
    {
      checkUndef(years, "years");
      checkUndef(skillsArray,"skillsArray");
      const resumeCollection = await userResume()
      const resumeList = await resumeCollection.find({$and: [{ skills: { $in: skillsArray}}, { yearsOfExperience: { $gte: years} }, { resumeActive : true}]}).toArray();
      // console.log(resumeList)
      return resumeList
    },

    async removeProjectFromResume(projectId)
    {
      checkUndef(projectId, "projectId");

      const resumeCollection = await userResume();
      const resume = await resumeCollection.findOne( { project: { $elemMatch: {_id: projectId } } });
      let resumeId = resume._id;

      const updateInfo = await resumeCollection.updateOne(
        { _id: resumeId },
        { $pull: { projects : { _id: projectId } } }
      );
      
      if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Update Failed`
      return await this.getResumeById(resumeID);
    }
}

module.exports = exportedMethods