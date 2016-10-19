'use strict';

var exec            = require('child_process').exec;
var models          = require( process.cwd() + '/server/models');
var _               = require('lodash');

module.exports = function(app) {

    app.use('/api/user',    require('./api/user'));
    app.use('/api/item',    require('./api/product'));
};