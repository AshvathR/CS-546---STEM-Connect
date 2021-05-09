const mongoCollections = require('../config/mongoCollections');
const workExperience = mongoCollections.workExperience;
const users = mongoCollections.users;
const objectId = require("mongodb").ObjectID;

function checkUndef(variable, variableName)
{
    if (variable === null || variable === undefined)
    {
        throw `${variableName || 'Provided Variable'} is not defined!`
    }
}

async function addWorkDesc(companyName, jobTitle, jobDescription,startDate, endDate)
{
  const workExperienceCollection = await workExperience();
    
  let newWork = {
    companyName : companyName,
    jobTitle: jobTitle,
    jobDescription:jobDescription,
    startDate:startDate,
    endDate: endDate          
  };
  // jobExperienceId = mongodb.ObjectId(jobExperienceId)
    
  const newInsertInformation = await workExperienceCollection.insertOne(newWork);
 // const newId = newInsertInformation.insertedId;
  // await loginInfo.addUserToAccount(jobExperienceId, newJob);
  console.log("Added workExperience")
  return newWork
  // return await thusis.getResumeById(newId);
}

async function getAllWorkDesc()
{
  const workExperienceCollection = await workExperience();
  const workExperienceList = await workExperienceCollection.find({}).toArray();
  if (!workExperienceList) throw `No jobs found!`;
  return workExperienceList;
}

async function getWorkDescById(id)
{
  checkUndef(id, "id");

  const workExperienceCollection = await workExperience();
  const workDesc = await workExperienceCollection.findOne({ _id: objectId(id) });
  if (!workDesc) throw `Work Description with the given ID: ${id} not found!`;
  return workDesc;
}

async function removeWorkDesc(id)
{
  checkUndef(id, "id");

  const workExperienceCollection = await workExperience();
  const deletionInfo = await workExperienceCollection.removeOne({ _id: objectId(id)} );

  if (deletionInfo.deletedCount == 0)
  {
    throw `Could not delete work description with id of ${id}`;
  }

  return true;
}

async function updateWorkDesc(id, userId, updatedWorkDesc)
{
  checkUndef(id, "id");
  checkUndef(userId, "userId");
  checkUndef(updatedWorkDesc, "updatedWorkDesc");

  const workDesc = await this.getWorkDescById(id);
  console.log(workDesc);

  let workDescInfo = 
  {
    companyName : updatedWorkDesc.companyName,
    jobTitle: updatedWorkDesc.jobTitle,
    jobDescription: updatedWorkDesc.jobDescription,
    startDate: updatedWorkDesc.startDate,
    endDate: updatedWorkDesc.endDate
  }

  const workExperienceCollection = await workExperience();
  const updateInfo = await workExperienceCollection.updateOne({ _id: objectId(id) }, { $set: workDescInfo });

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Update Failed`;
  else console.log(`Work Description Updated Successfully`);

  const userCollection = await users();

  const tempWorkDesc = await userCollection.updateOne(
  {
    _id: objectId(userId),
    "workExperience._id": objectId(id)
  },
  {
    $set: 
    {
      "workExperience.$.companyName": updatedWorkDesc.companyName,
      "workExperience.$.jobTitle": updatedWorkDesc.jobTitle,
      "workExperience.$.jobDescription": updatedWorkDesc.jobDescription,
      "workExperience.$.startDate": updatedWorkDesc.startDate,
      "workExperience.$.endDate": updatedWorkDesc.endDate
    }
  }, false, true);

  return await this.getWorkDescById(id);
}

module.exports = 
{
  addWorkDesc,
  getAllWorkDesc,
  getWorkDescById,
  removeWorkDesc,
  updateWorkDesc
};