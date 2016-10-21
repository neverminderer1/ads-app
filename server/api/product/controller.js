'use strict';

var fs              = require('fs');
var config          = require(process.cwd()+ '/server/config');
var models          = require( process.cwd()+'/server/models');
var _               = require('lodash');
var sanitizeHtml    = require('sanitize-html');

var validationError = function(res, err) {
    for (var i = 0; i < err.errors.length; i++) {
        if (err.errors[i].type === 'notNull Violation' || err.errors[i].type === 'Validation error') {
            return res.status(422).json({
                "field": err.errors[i].path,
                "message": err.errors[i].message
            });
        }
    }
};

exports.index = function (req, res, next) {
    var where = {};
    var whereUser = {};
    var order = ['createdAt', 'DESC'];

    if (req.query.title) {
        where.title = req.query.title;
    };

    if (req.query.userId) {
        whereUser.userId = req.query.userId;
    };

    if (req.query.order_by === 'price') {
        order[0] = req.query.order_by;
    };

    if (req.query.order_type === 'asc') {
        order[1] = req.query.order_type;
    };

    models.product.findAll({
        order: [order],
        include: [{
            model: models.user,
            attributes: ['id', 'phone', 'email', 'name'],
            where: whereUser
        }],
        where: where
    }).then(function (products) {
        return res.json(products);
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

    if (!req.body.title) {
        return res.status(422).json({ field: "title", message: "Title field is empty" });
    };

    req.body.title  = sanitizeHtml(req.body.title);
    req.body.price  = parseFloat(req.body.price);
    req.body.userId = req.user.id;

    models.product.create(req.body).then(function (product) {

        return models.product.findOne({
            include: [{
                model: models.user,
                attributes: ['id', 'phone', 'email', 'name']
            }],
            where: { id: product.id }
        });

    }).then(function (product) {
        return res.json(product);
    }).catch(function (err) {
        validationError(res, err);
    });
};

exports.update = function (req, res, next) {

    if (req.body.id) {
        delete req.body.id;
    };

    if (req.body.title) {
        req.body.title = sanitizeHtml(req.body.title);
    };

    if (req.body.price) {
        req.body.price = parseFloat(req.body.price);
    };

    if (req.body.image) {
        delete req.body.image;
    };

    models.product.findOne({
        include: [{
            model: models.user,
            attributes: ['id', 'phone', 'email', 'name']
        }],
        where: { id: req.params.id }
    }).then(function (product) {

        if (!product) {
            return res.status(404).json({});
        };

        if (product.userId !== req.user.id) {
            return res.status(403).json({});
        };

        product = _.merge(product, req.body);

        product.save().then(function (product) {
            return res.json(product);
        }).catch(function (err) {
            next(err);
        });

    }).catch(function (err) {
        validationError(res, err);
    });

};

exports.destroy = function (req, res, next) {

    models.product.findById(req.params.id).then(function (product) {

        if (!product) {
            return res.status(404).json({});
        };

        if (product.userId !== req.user.id) {
            return res.status(403).json({});
        };

        product.destroy().then(function () {
            return res.status(200).json({});
        }).catch(function (err) {
            next(err);
        });

    }).catch(function (err) {
        next(err);
    });

};

exports.addImage = function (req, res, next) {

    if (req.files.file) {

        models.product.findOne({
            include: [{
                model: models.user,
                attributes: ['id', 'phone', 'email', 'name']
            }],
            where: { id: req.params.id }
        }).then(function (product) {

            if (!product) {
                return res.status(404).json({});
            };

            if (product.userId !== req.user.id) {
                return res.status(403).json({});
            };
            console.log(product.image)
            if (product.image) {
                fs.unlinkSync(config.assetsDir+'/'+product.image);
            };

            var file = req.files.file.path.split('/');
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

            if (!product) {
                return res.status(404).json({});
            };

            if (product.userId !== req.user.id) {
                return res.status(403).json({});
            };

            if (product.image) {
                fs.unlinkSync(config.assetsDir+'/'+product.image);
            };

            product.image = null;

            product
                .save()
                .then(function () {
                    return res.status(200).json({});
                }).catch(function (err) {
                    next(err);
                });

        }).catch(function (err) {
            next(err);
        });

};