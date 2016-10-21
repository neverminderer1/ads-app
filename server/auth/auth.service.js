'use strict';

var jwt         = require('jsonwebtoken');
var config      = require('./../config');
var expressJwt  = require('express-jwt');
var compose     = require('composable-middleware');
var models      = require( process.cwd()+'/server/models');

var validateJwt = expressJwt({
    secret: config.secrets.session
});

function register(req, res, next) {

    if (!req.body.name) {
        res.status(422).send({"field":"name","message":"The field is empty"});
    };

    if (!req.body.email) {
        res.status(422).send({"field":"email","message":"The field is empty"});
    };

    if (!req.body.password) {
        res.status(422).send({"field":"password","message":"The field is empty"});
    };

    models.user.create(req.body).then(function (user) {
        res.send({"token": signToken(user.id)});
    }).catch(function (err) {
        next(err);
    });

};

function login(req, res, next) {

    if (!req.body.email) {
        res.status(422).send({"field":"email","message":"The field is empty"});
    };

    if (!req.body.password) {
        res.status(422).send({"field":"password","message":"The field is empty"});
    };

    models.user.findOne({
        where: {
            email: req.body.email
        }
    }).then(function (user) {
        if (!user) {
            res.status(422).send({"field":"email","message":"Wrong email"});
        };

        if (!user.authenticate) {
            res.status(422).send({"field":"password","message":"Wrong password"});
        };

        res.send({"token": signToken(user.id)});
    }).catch(function (err) {
        next(err);
    });

};

function signToken(id){
    return jwt.sign(
        { id: id },
        config.secrets.session,
        { expiresIn: "300d" }
    );
}

function isAuthenticated() {
    return compose()
        .use(function(req, res, next) {
            if (req.headers.authorization) {
                req.headers.authorization = 'Bearer ' + req.headers.authorization;
            }
            validateJwt(req, res, next);
        })
        .use(function(req, res, next) {
            models.user.findById(req.user.id).then(function(user) {
                if (!user) return res.sendStatus(401);

                req.user = user;
                next();
            });
        });
}

exports.isAuthenticated = isAuthenticated;
exports.register        = register;
exports.login           = login;