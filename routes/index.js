<<<<<<< HEAD
const aboutUs = require('./aboutUs');
const companyProfile = require('./companyProfile');
const landing = require('./landing');
const login = require('./login');
const userProfile = require('./userProfile');
const notFoundError = require('./404pags.js');

const constructorMethod = (app) => {
    app.use('/about', aboutUs);
    app.use('/company', companyProfile);
    app.use('/landing', landing);
    app.use('/login', login);
    app.use('/user', userProfile);

    app.use('*', notFoundError);
=======
const loginRoutes = require('./login');
const signupRoutes = require('./signup');

const constructorMethod = (app) => {
  app.use('/login', loginRoutes);
  app.use('/signup', signupRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
>>>>>>> 732b3fdfccfeeeff524dc4d5619cda216f017027
};

module.exports = constructorMethod;