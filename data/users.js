const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
var mongodb = require('mongodb');
const { userResume } = require('../config/mongoCollections');
const loginInfo = require('./loginInfo'); 

function checkUndef(variable, variableName)
{
    if (variable === null || variable === undefined)
    {
        throw `${variableName || 'Provided Variable'} is not defined!`
    }
}

let exportedMethods = {

  async addUser( profilePictureUrl, email,address, firstName, lastName, phoneNumber, aboutMe, gender, dob, resumeUrl) {
    const userCollection = await users();

    let newUser = {
      profilePictureUrl: profilePictureUrl,
      email:email,
      address:address,
      name:{firstName: firstName , lastName: lastName},
      phoneNumber: phoneNumber,
      aboutMe: aboutMe,
      gender:gender,
      dob: dob,
      resumeUrl:[resumeUrl],
      // accountId:accountId,
      workExperience:[],
      resume:[]
       
    };
    // accountId = mongodb.ObjectId(accountId)

    const newInsertInformation = await userCollection.insertOne(newUser);
    // const newId = newInsertInformation.insertedId;
    // await loginInfo.addUserToAccount(accountId, newUser);
    console.log("Added User")
    return newUser
    // return await this.getResumeById(newId);
  },

  async addResumeToUser(userId, newResume) {
    checkUndef(userId, "userId");
    checkUndef(newResume, "newResume");
    
    let currentUser = await this.getUserById(userId);
    const userCollection = await users();
    // const resumeCollection = await userResume();

    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $addToSet: { resume: newResume } }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';

    return await this.getUserById(userId);
  },

  async addWorkDesToUser(userId, newWorkExperience) {
    checkUndef(userId, "userId");
    checkUndef(newWorkExperience, "newWorkExperience");
    
    let currentUser = await this.getUserById(userId);
    const userCollection = await users();
    // const resumeCollection = await userResume();

    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $addToSet: { workExperience: newWorkExperience } }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';

    return await this.getUserById(userId);
  },

  async getUserById(id) {
    checkUndef(id, "id");
    const userCollection = await users();
    // console.log(id)
    const user = await userCollection.findOne({  _id:mongodb.ObjectId(id) });
    // console.log(user)
    if (!user) throw 'User not found';
    return user;
  },

  async getAllUsers()
  {
    const userCollection = await users();
    return await userCollection.find({}).toArray();
  },

  async removeResumeFromUser(resumeId)
  {
    checkUndef(resumeId);

    const userCollection = await users();
    const user = await userCollection.findOne({ resume: {$elemMatch : {_id: mongodb.ObjectID(id)} } });
    console.log(user);
    let userId = user._id;

    const updatedInfo = await userCollection.updateOne(
      {_id: userId},
      {$pull : {resume: {_id: resumeId } } }
    );

    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) throw `Update Failed!`
    return await this.getUserById(userId);
  }
}

module.exports = exportedMethods