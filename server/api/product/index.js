'use strict';

var express     = require('express');
var controller  = require('./controller');
var router      = express.Router();
var config      = require(process.cwd()+ '/server/config');
var multipart   = require('connect-multiparty');
var auth        = require(process.cwd() + '/server/auth/auth.service');

router.get('/', 	controller.index);
router.get('/:id',  controller.get);

router.put('/:id',      auth.isAuthenticated(),     controller.update);
router.post('/',        auth.isAuthenticated(),     controller.create);
router.delete('/:id',   auth.isAuthenticated(),     controller.destroy);

router.post('/:id/image',   auth.isAuthenticated(), multipart({uploadDir: config.assetsDir}), controller.addImage);
router.delete('/:id/image', auth.isAuthenticated(), controller.destroyImage);

module.exports = router;