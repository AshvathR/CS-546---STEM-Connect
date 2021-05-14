const mongoCollections = require('../config/mongoCollections');
const users= mongoCollections.users;
const userResume = mongoCollections.userResume;
const usersFunc = require('./users');
const objectId = require('mongodb').ObjectID;
const projectFunc = require("./projects");

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
      let x = [];

      try
      {
        resume = await this.getResumeById(resumeId);
      }
      catch(e)
      {
        console.log(e);
      }

      for (let i = 0; i < (resume.projects).length; i++)
      {
        x[i] = resume.projects[i]._id;
      }
      console.log(x);

      const deletionInfo = await resumeCollection.removeOne({ _id: objectId(resumeId) });
      if (deletionInfo.deletedCount == 0) throw `Could not delete resume with the ID of ${resumeId}`;

      const userCollection = await users();

      const resumeRemove = await userCollection.updateOne(
        {
          _id: objectId(userId),
          "resume._id": objectId(resumeId)
        },
        {
          $pull: { resume: { _id: objectId(resumeId) } }
        }, false, true
      );

      for (let i = 0; i < x.length; i++)
      {
        const removeProject = await projectFunc.removeProject( x[i], resumeId, userId);
      }
      
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


// Data Functions for Search Page
    
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

      // if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Update Failed!`

      const userCollection = await users();

      const resumeUpdate = await userCollection.updateOne
      (
        {
          _id: objectId(userId),
          "resume._id": objectId(resumeId)
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
    async searchResumeByYearSkillsProjectNumber(years,skillsArray,projectNumber)
    {
      checkUndef(years, "years");
      checkUndef(projectNumber, "projectNumber")
      checkUndef(skillsArray,"skillsArray");
      let skillsQuery = {};
      let projectQuery = {};

      
      const resumeCollection = await userResume();

      if(isNaN(years)) throw "Invalid year: Not a number!";

      if(projectNumber != -1){
        if(isNaN(projectNumber)) throw "Invalid project number: Not a number!";
        //if(projectNumber > 0) projectQuery = { $where: "this.projects.length > " + parseInt(projectNumber) };
      }
      
      if(skillsArray != "noSkills"){
        if(!Array.isArray(skillsArray)) throw "Invalid skills: Not an Array!";

        if(skillsArray.length > 0) skillsQuery = { skills: { $in: skillsArray}};
      }
      const resumeList = await resumeCollection.find({$and: [{ resumeActive : true}, { yearsOfExperience: { $gte: years} }, skillsQuery, projectQuery]}).toArray();
      //console.log(resumeList)
      return resumeList;

    }
}

module.exports = exportedMethods