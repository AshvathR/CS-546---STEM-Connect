const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const resumes = mongoCollections.userResume;
const users = mongoCollections.users;
const resumeFunc = require("./userResume");
const objectId = require('mongodb').ObjectID;

function checkUndef(variable, variableName)
{
  if (variable === null || variable === undefined)
  {
    throw `${variableName || 'Provided Variable'} is not defined!`
  }
}

let exportedMethods = {
    async addProject(projectTitle, description, startDate, endDate) {

        const projectCollection = await projects();
    
        const newProject = {
          projectTitle: projectTitle,//array_of_objects
          description: description,//array_of_objects,sub document
          startDate:startDate,//array_of_object,sub document
          endDate: endDate,//array_of_skills
        };
    
        const newInsertInformation = await projectCollection.insertOne(newProject);
        console.log("Added newProject");
        return newProject;
    },

    async getAllProjects()
    {
      const projectCollection = await projects();
      const projectList = await projectCollection.find({}).toArray();
      if (!projectList) throw `No projects found!`
      return projectList;
    },

    async getProjectById(id)
    {
      checkUndef(id, "id");

      const projectCollection = await projects();
      const project = await projectCollection.findOne({ _id: objectId(id) });

      if (!project) throw `Project with the given ID ${id} not found!`;
      return project;
    },

    async removeProject(id)
    {
      checkUndef(id, "id");

      const projectCollection = await projects();
      let project = null;

      try
      {
        project = await this.getProjectById(id);
      }
      catch (e)
      {
        console.log(e)  ;
      }

      let temp = project._id;
      
      const deletionInfo = await projectCollection.removeOne({ _id: objectId(id) });
      if (deletionInfo.deletedCount == 0)
        throw `Could not delete project with the ID ${id}`;
      
      return true;
    },

    async updateProject(id, resumeId, userId, updatedProject)
    {
      checkUndef(id, "id");
      checkUndef(updatedProject, "updatedProject");
      checkUndef(resumeId, "resumeId");
      checkUndef(userId, "userId");

      const project = this.getProjectById(id);
      
      let projectUpdateInfo =
      {
        projectTitle: updatedProject.projectTitle,
        description: updatedProject.description,
        startDate: updatedProject.startDate,
        endDate: updatedProject.endDate
      }

      const projectCollection = await projects();
      const updateInfo = await projectCollection.updateOne({ _id: objectId(id) }, { $set: projectUpdateInfo });

      if (!updateInfo.matchedCount && !updateInfo.modifiedCout) throw `Update Failed`;
      else console.log(`Project Updated Successfully!`);

      const resumeCollection = await resumes();

      const tempProject = await resumeCollection.updateOne(
      {
        _id: resumeId,
        "projects._id": id
      },
      {
        $set:
        {
          "projects.$.projectTitle": updatedProject.projectTitle,
          "projects.$.description": updatedProject.description,
          "projects.$.startDate": updatedProject.startDate,
          "projects.$.endDate": updatedProject.endDate
        }
      }, false, true);

      const currentResume = await resumeFunc.getResumeById(resumeId);

      const userCollection = await users();

      const temperProject = await userCollection.updateOne(
      {
        _id: userId,
        "resume._id": resumeId
      },
      {
        $set:
        {
          "resume.$.education": currentResume.education,
          "resume.$.projects": currentResume.projects,
          "resume.$.skills": currentResume.skills,
          "resume.$.workStatus": currentResume.workStatus,
          "resume.$.description": currentResume.description,
          "resume.$.resumeActive": currentResume.resumeActive,
          "resume.$.userResumeUrl": currentResume.userResumeUrl          
        }
      }, false, true);
      
      return await this.getProjectById(id);
    }
}

module.exports = exportedMethods