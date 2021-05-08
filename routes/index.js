const aboutUs = require('./aboutUs');
const companyProfile = require('./companyProfile');
const landing = require('./landing');
//const loginRoutes = require('./login');
//const signupRoutes = require('./signup');
const userProfile = require('./userProfile');
const notFoundError = require('./404page.js');

const constructorMethod = (app) => {
    app.use('/', landing);
    //app.use('/about', aboutUs);
    //app.use('/company', companyProfile);
    //app.use('/user', userProfile);
    //app.use('/login', loginRoutes);
    //app.use('/signup', signupRoutes);
    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

module.exports = constructorMethod;