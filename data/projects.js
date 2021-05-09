const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const resumes = mongoCollections.userResume;
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
        // userId = mongodb.ObjectId(userId)
    
        const newInsertInformation = await projectCollection.insertOne(newProject);
        // const newId = newInsertInformation.insertedId;
        // await users.addResumeToUser(userId, newResume);
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
      const deletionInfo = await projectCollection.removeOne({ _id: objectId(id) });

      if (deletionInfo.deletedCount == 0)
        throw `Could not delete project with the ID ${id}`;
      
      return true;
    },

    async updateProject(id, updatedProject, resumeId)
    {
      checkUndef(id, "id");
      checkUndef(updatedProject, "updatedProject");
      checkUndef(resumeId, "resumeId");

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
        _id: objectId(resumeId),
        "projects._id": objectId(id)
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

      return await this.getProjectById(id);
    }
}

module.exports = exportedMethods