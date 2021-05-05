const mongoCollections = require('../config/mongoCollections');
const company = mongoCollections.company;

let exportedMethods = {

    async addCompany(companyName, location, category, hrEmail) {

        const companyCollection = await company();
    
        const newCompany = {
          companyName: companyName,//array_of_objects
          location: location,//array_of_objects,sub document
          category:category,//array_of_object,sub document
          hrEmail: hrEmail,//array_of_skills
          jobDetails:[]
        };
        // userId = mongodb.ObjectId(userId)
    
        const newInsertInformation = await companyCollection.insertOne(newCompany);
        // const newId = newInsertInformation.insertedId;
        // await users.addResumeToUser(userId, newResume);
        console.log("Added newCompany")
        return newCompany
    }


}

module.exports = exportedMethods