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
};

module.exports = constructorMethod;