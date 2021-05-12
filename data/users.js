const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const userRes = require('./userResume')
var mongodb = require('mongodb');
const { userResume } = require('../config/mongoCollections');
const loginInfo = require('./loginInfo'); 
const bcrypt = require('bcryptjs');

function checkUndef(variable, variableName)
{
    if (variable === null || variable === undefined)
    {
        throw `${variableName || 'Provided Variable'} is not defined!`
    }
}

let exportedMethods = {

  async addUser(profilePictureUrl, email,address, firstName, lastName, phoneNumber, aboutMe, gender, dob, resumeUrl, username, hashedPassword) {
    const userCollection = await users();

    let newUser = {
      profilePictureUrl: profilePictureUrl,
      email:email,
      address:address,
      name:{firstName: firstName , lastName: lastName, fullName: firstName + ' ' + lastName},
      phoneNumber: phoneNumber,
      aboutMe: aboutMe,
      gender:gender,
      dob: dob,
      resumeUrl:[resumeUrl],
      // accountId:accountId,
      workExperience:[],
      resume:[],
      username: username,
      hashedPassword: hashedPassword
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
    
    let currentResume = await userRes.getResumeById(newResume._id);
    const userCollection = await users();
    // const resumeCollection = await userResume();

    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $addToSet: { resume: currentResume } }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';

    return await this.getUserById(userId);
  },

  async findUserByResumeId(resumeId) {
    checkUndef(resumeId, "resumeId");
    
    const userCollection = await users();
    const user = await userCollection.find({  "resume._id": mongodb.ObjectId(resumeId) }).toArray();
    
    if (!user) throw 'User not found';
    return user;
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
    const user = await userCollection.findOne({  _id: mongodb.ObjectId(id) });
    
    if (!user) throw 'User not found';
    return user;
  },

  async getAllUsers()
  {
    const userCollection = await users();
    let userList = await userCollection.find({}).toArray();
    if (!userList) throw 'No users in System';
    return userList;
  },

  async getAllUsername() {
    const userCollection = await users();
    const userList = await userCollection.find({},{ projection: { _id: 1, username: 1}}).toArray();
    return userList;
  },

  async getPartialNameMatch(partialName){
    if(!partialName) throw 'Invalid Lookup';
    const userCollection = await users();
    let match = new RegExp('^' + partialName);
    const partialMatchList = await userCollection.find({ "name.fullName": match}, {projection: {_id: 1, "name.fullName": 1}}).toArray();
    return partialMatchList;
  },

  async checkExistingUsername(username){
    checkUndef(username, "username");
    console.log(username)
    const allUsername = await this.getAllUsername();
    for(let current of allUsername ){
      // console.log(current.username)
      let currentUsername = current.username.toLowerCase();
      username = username.toLowerCase();
      if(currentUsername === username){
        return true;
      }
    }
    return false;
  },

  async removeResumeFromUser(resumeId)
  {
    checkUndef(resumeId);

    const userCollection = await users();
    const user = await userCollection.findOne({ resume: {$elemMatch : {_id: mongodb.ObjectID(id)} } });
    let userId = user._id;

    const updatedInfo = await userCollection.updateOne(
      {_id: userId},
      {$pull : {resume: {_id: resumeId } } }
    );

    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) throw `Update Failed!`
    return await this.getUserById(userId);
  },

  async checkUsernameandPassword(username, password){
    username = username.toLowerCase();
    let usernameExists = await this.checkExistingUsername(username);
    const allUsers = await this.getAllUsers();
    for(let current of allUsers ){
      let currentEmail = current.email.toLowerCase();
      if(currentEmail === username){
        usernameExists = true;
      }
    }
    if(!usernameExists){
      return false;
    } 
    for(let current of allUsers ){
      let currentEmail = current.email.toLowerCase();
      let currentUserName = current.username.toLowerCase();
      if(username === currentEmail || username === currentUserName){
        let checkPassword = await bcrypt.compare(password, current.hashedPassword);
        return checkPassword;
      }
    }
  },


  async getUserID(username) {
    checkUndef(username, "Username");
    const userCollection = await users();
    let user = await userCollection.findOne({  username: username });
    // console.log(user);
    if (!user){
      user = await userCollection.findOne({email: username})
    };
    return user._id;
  },

  async removeUser (id)
  {
    const userCollection = await users();
    let user = null;

    try
    {
      user = await this.getUserById(id);
    }
    catch (e)
    {
      console.log(e);
    }

    const deletionInfo = await userCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount == 0) throw `Could not delete the user with ID: ${id}`;
    else return true
  }
}
module.exports = exportedMethods