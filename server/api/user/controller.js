'use strict';

var models          = require( process.cwd()+'/server/models');
var _               = require('lodash');

exports.index = function (req, res, next) {

    if (!_.isEmpty(req.query)) {
        var where = {};

        if (req.query.name) {
            where.name = req.query.name;
        }

        if (req.query.email) {
            where.email = req.query.email;
        }

        models.user.findAll({
            attributes: ['id', 'phone', 'email', 'name'],
            where: where
        }).then(function (users) {

            if (users) {
                return res.json(users);
            }

            return res.json({});
        }).catch(function (err) {
            next(err);
        })
    } else {
        next();
    }

};

exports.get = function (req, res, next) {

   if (!_.isEmpty(req.params) && req.params.id) {

       models.user.findOne({
           attributes: ['id', 'phone', 'email', 'name'],
           where: { id: req.params.id }
       }).then(function (user) {

           if (user) {
               return res.json(user);
           }

           return res.status(404).json({});
       }).catch(function (err) {
           next(err);
       });
   } else {
       next();
   }

};