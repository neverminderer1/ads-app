'use strict';

var express        = require('express');
var morgan         = require('morgan');
var compression    = require('compression');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var path           = require('path');
var config         = require('./index');

module.exports = function (app) {
    var env = app.get('env');

    app.use(compression());
    app.use(bodyParser.urlencoded({limit: '10mb', extended: false }));
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(methodOverride());
    app.set('appPath', config.root);
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
};