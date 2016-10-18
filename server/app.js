'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global.APP_DIR       = __dirname;

var express          = require('express');
var config           = require(APP_DIR + '/config');

var app              = express(); app.disable('x-powered-by');
var server           = require('http').createServer(app);

require(APP_DIR + '/config/express')(app);
require(APP_DIR + '/routes')(app);

server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

var exports = module.exports = app;