'use strict';

var models     = require( process.cwd()+'/server/models');

exports.get = function (req, res, next) {

    if (!req.user || !req.user.id) {
        res.status(404).send("User not found");
    };

    models.user.findOne({
        attributes: ['id', 'phone', 'email', 'name'],
        where: { id: req.user.id }
    }).then(function (user) {
        if (!user) res.status(404).send("User not found");

        res.json(user);
    }).catch(function (err) {
        next(err);
    });

};

exports.update = function (req, res, next) {
    if (req.body.id) {
        delete req.body.id;
    };

    if (!req.user || !req.user.id) {
        res.status(404).send({ message: "User not found" });
    };

    if (req.body && req.body.new_password && !req.body.current_password) {
        res.status(422).send({ message: "Current password required" })
    };

    models.user.findById(req.user.id).then(function (user) {
        if (!user) res.status(404).send({ message: "User not found" });

        if (req.body.new_password && !user.authenticate(req.body.current_password)) {
            res.status(401).send({ message: "Wrong current password" });
        } else {
            user.password = req.body.new_password;
        }

        user = _.merge(user, req.body);

        user
            .save()
            .then(function (user) {

                models.user.findOne({
                    attributes: ['id', 'phone', 'email', 'name'],
                    where: { id: user.id }
                }).then(function (user) {
                    res.json(user);
                }).catch(function (err) {
                    next(err);
                });


            }).catch(function (err) {
                next(err);
            });

    }).catch(function (err) {
        next(err);
    });

};