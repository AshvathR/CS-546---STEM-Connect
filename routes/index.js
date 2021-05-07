const loginRoutes = require('./login');
const signupRoutes = require('./signup');

const constructorMethod = (app) => {
  app.use('/login', loginRoutes);
  app.use('/signup', signupRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;