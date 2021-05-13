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
          education: education,//array_of_objects
          // workExperience: [],//array_of_objects,sub document (Removed Because wrong Cardinality)
          projects: [],//array_of_object,sub document
          skills: skills,//array_of_skills
          workStatus:workStatus,
          yearsOfExperience: yearsOfExperience,
          description:description,
          resumeActive:resumeActive,
          userResumeUrl:userResumeUrl
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

    async removeResume(id)
    {
      checkUndef(id, 'id');
      
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

      await usersFunc.removeResumeFromUser(temp)
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

    async updateResume(id, userId, updatedResume)
    {
      checkUndef(id, "id");
      checkUndef(userId, "userId");
      checkUndef(updatedResume, "updatedResume");

// Data Functions for Search Page
    
      const resume = await this.getResumeById(id);

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
      const updateInfo = resumeCollection.updateOne( { _id: objectId(id) }, { $set: resumeUpdateInfo } );

      if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Update Failed!`

      const userCollection = await users();

      const resumeUpdate = await userCollection.updateOne
      (
        {
          _id: userId,
          "resume._id": id
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

      return await this.getResumeById(id);
    },
    async searchResumeByYearSkillsProjectNumber(years,skillsArray,projectNumber)
    {
      checkUndef(years, "years");
      checkUndef(projectNumber, "projectNumber")
      checkUndef(skillsArray,"skillsArray");
      const resumeList = [null];
      const resumeCollection = await userResume();
      if(skillsArray.length < 1) {
        const resumeList = await resumeCollection.find({$and: [{ resumeActive : true}, { yearsOfExperience: { $gte: years} }, { projects: {$size: parseInt(projectNumber)} } ]}).toArray();
      }else{
        const resumeList = await resumeCollection.find({$and: [{ resumeActive : true}, { yearsOfExperience: { $gte: years} }, { projects: {$size: parseInt(projectNumber)} }, { skills: { $in: skillsArray}}]}).toArray();
      }
      // console.log(resumeList)
      return resumeList;
    }

    // async removeProjectFromResume(projectId, resumeId)
    // {
    //   checkUndef(projectId, "projectId");

    //   const resumeCollection = await userResume();
    //   // const resume = await resumeCollection.findOne({ project: { $elemMatch: {_id: projectId } } });
    //   // let resumeId = resume._id;

    //   // const updateInfo = await resumeCollection.updateOne(
    //   //   { _id: resumeId },
    //   //   { $pull: { project : { _id: projectId } } }
    //   // );

    //   // if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Update Failed`
    //   // return await this.getResumeById(resumeID);

    //   const updateInfo = await resumeCollection.updateOne
    //   (
    //     {
    //       _id: resumeId
    //     },
    //     {
    //       $pull:
    //       {
    //         projects: { _id: projectId }
    //       }
    //     }
    //   );

    //   if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Deletion Failed!`;
    //   return await this.getResumeById(resumeId);
    // }
}

module.exports = exportedMethods