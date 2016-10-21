'use strict';

var express     = require('express');
var controller  = require('./controller');
var router      = express.Router();
var auth        = require(process.cwd() + '/server/auth/auth.service');

router.get('/', auth.isAuthenticated(),    controller.get);
router.put('/', auth.isAuthenticated(),    controller.update);

module.exports = router;