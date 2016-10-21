'use strict';

var models = require( process.cwd()+'/server/models');

exports.index = function (req, res, next) {
    var where = {};

    if (req.query.name) {
        where.name = req.query.name;
    };

    if (req.query.email) {
        where.email = req.query.email;
    };

    models.user.findAll({
        attributes: ['id', 'phone', 'email', 'name'],
        where: where
    }).then(function (users) {
        return res.json(users);
    }).catch(function (err) {
        next(err);
    });

};

exports.get = function (req, res, next) {

   models.user.findOne({
       attributes: ['id', 'phone', 'email', 'name'],
       where: { id: req.params.id }
   }).then(function (user) {

       if (!users) {
           return res.status(404).json({});
       };

       return res.json(user);
   }).catch(function (err) {
       next(err);
   });

};