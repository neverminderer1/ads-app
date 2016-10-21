'use strict';

var express     = require('express');
var controller  = require('./controller');
var router      = express.Router();
var auth        = require(process.cwd() + '/server/auth/auth.service');

router.get('/',    controller.index);
router.get('/:id', auth.isAuthenticated(), controller.get);

module.exports = router;