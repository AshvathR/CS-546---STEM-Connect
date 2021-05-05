// const { users } = require('../config/mongoCollections');
const mongoCollections = require('../config/mongoCollections');
const userResume = mongoCollections.userResume;
const users = require('./users')

let exportedMethods = {

    async addResume(education, skills, description, userResumeUrl, workStatus, resumeActive) {

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
        // const newId = newInsertInformation.insertedId;
        // await users.addResumeToUser(userId, newResume);
        console.log("Added Resume")
        return newResume
    },


}

module.exports = exportedMethods