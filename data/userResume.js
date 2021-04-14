// const { users } = require('../config/mongoCollections');
const mongoCollections = require('../config/mongoCollections');
const userResume = mongoCollections.userResume;
const users = require('./users')

let exportedMethods = {

    async addResume(education, workExperience, projects, skills, userId) {

        const resumeCollection = await userResume();
    
        const newResume = {
          education: education,//array_of_objects
          workExperience: workExperience,//array_of_objects,
          projects: projects,
          skills: skills,//array_of_skills
        };
        userId = mongodb.ObjectId(userId)
    
        const newInsertInformation = await resumeCollection.insertOne(newResume);
        const newId = newInsertInformation.insertedId;
        await users.addResumeToUser(userId, newResume);
        console.log("Added Resume")
        return await this.getReviewById(newId);
    },


}

module.exports = exportedMethods