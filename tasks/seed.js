const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const loginInfo = data.loginInfo;
const userResume = data.userResume;
const users = data.users;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  try {
    const account = await loginInfo.addAccount('SHUBHAMWARGHADE','qwertyuiop')
    const id = loginInfo._id;
    await users.addUser('asada.jpeg','shubham@shubham.shubham',' 123 address, deep, NYC', 'Shubham', 'Warghade', '123456789', 'I am batman!','M',id)
  }catch(e){
    console.log (e);
  }

  
  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();