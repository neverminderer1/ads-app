'use strict';

var fs              = require('fs');
var config          = require(process.cwd()+ '/server/config');
var models          = require( process.cwd()+'/server/models');
var _               = require('lodash');
var sanitizeHtml    = require('sanitize-html');

exports.index = function (req, res, next) {
    var where = {};
    var whereUser = {};
    var order = ['createdAt', 'DESC'];

    if (req.query.title) {
        where.title = req.query.title;
    }

    if (req.query.userId) {
        whereUser.userId = req.query.userId;
    }

    if (req.query.order_by === 'price') {
        order[0] = req.query.order_by;
    }

    if (req.query.order_type === 'asc') {
        order[1] = req.query.order_type;
    }

    models.product.findAll({
        order: order,
        include: [{
            model: models.user,
            attributes: ['id', 'phone', 'email', 'name'],
            where: whereUser
        }],
        where: where
    }).then(function (products) {
        if (products) {
            return res.json(products);
        } else {
            return res.json({});
        }
    }).catch(function (err) {
        next(err);
    });
};

exports.get = function (req, res, next) {

    models.product.findOne({
        include: [{
            model: models.user,
            attributes: ['id', 'phone', 'email', 'name']
        }],
        where: { id: req.params.id }
    }).then(function (product) {
        if (product) {
            return res.json(product);
        } else {
            return res.status(404).json({});
        }
    }).catch(function (err) {
        next(err);
    });

};

exports.create = function (req, res, next) {
    req.body.title = sanitizeHtml(req.body.title);
    req.body.price = parseFloat(req.body.price);
    req.body.userId = req.body.userId;

    models.product.create(req.body).then(function (product) {

        return models.product.findOne({
            include: [{
                model: models.user,
                attributes: ['id', 'phone', 'email', 'name']
            }],
            where: { id: product.id }
        })

    }).then(function (product) {
        return res.json(product);
    }).catch(function (err) {
        next(err);
    });
};

exports.update = function (req, res, next) {

    if (req.body.id) {
        delete req.body.id;
    }

    if (req.body.title) {
        req.body.title = sanitizeHtml(req.body.title);
    }

    if (req.body.price) {
        req.body.price = parseFloat(req.body.price);
    }

    models.product.findOne({
        include: [{
            model: models.user,
            attributes: ['id', 'phone', 'email', 'name']
        }],
        where: { id: req.params.id }
    }).then(function (product) {
        if (!product) return res.status(404);

        product = _.merge(product, req.body);

        product.save().then(function (product) {
            res.json(product);
        }).catch(function (err) {
            next(err);
        });

    }).catch(function (err) {
        next(err);
    });

};

exports.destroy = function (req, res, next) {

    models.product.findById(req.params.id).then(function (product) {
        if (!product) return res.status(404);

        product.destroy().then(function () {
            return res.sendStatus(200);
        }).catch(function (err) {
                next(err);
        });

    }).catch(function (err) {
        next(err);
    });

};

exports.addImage = function (req, res, next) {

    if (req.files.files) {
        models.product.findOne({
            include: [{
                model: models.user,
                attributes: ['id', 'phone', 'email', 'name']
            }],
            where: { id: req.params.id }
        }).then(function (product) {
            if (!product) return res.sendStatus(404);

            if (product.image) {
                fs.unlinkSync(config.assetsDir+'/'+product.image);
            };

            var file = req.files.files.path.split('/');
            product.image = file[file.length-1];

            product
                .save()
                .then(function (product) {
                    return res.json(product);
                }).catch(function (err) {
                next(err);
            });

        }).catch(function (err) {
            next(err);
        });
    }
};

exports.destroyImage = function (req, res, next) {

    models.product.findById(req.params.id)
        .then(function (product) {
            if (!product) return res.sendStatus(404);

            if (product.image) {
                fs.unlinkSync(config.assetsDir+'/'+product.image);
            };

            product.image = null;

            product
                .save()
                .then(function () {
                    return res.sendStatus(200);
                }).catch(function (err) {
                    next(err);
                });

        }).catch(function (err) {
            next(err);
        });

};