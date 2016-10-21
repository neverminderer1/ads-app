'use strict';

var auth        = require(process.cwd() + '/server/auth/auth.service');

module.exports = function(app) {

    app.use('/api/user',        require('./api/user'));
    app.use('/api/item',        require('./api/product'));
    app.use('/api/register',    auth.register);
    app.use('/api/login',       auth.login);

};