const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const users = require('./users')

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
    }


}

module.exports = exportedMethods