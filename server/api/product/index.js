'use strict';

var express    = require('express');
var controller = require('./controller');
var router     = express.Router();

router.get('/', 	  	 	controller.index);
router.get('/:id',  	    controller.get);

router.put('/:id',  	    controller.update);
router.post('/',  	        controller.create);
router.delete('/:id',  	    controller.destroy);

router.post('/:id/image',  	controller.addImage);
router.delete('/:id/image', controller.destroyImage);

module.exports = router;