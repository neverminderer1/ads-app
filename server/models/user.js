'use strict';

var crypto  = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('user', {
        id: {
            type:      DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Password field is empty" }
            },
            set: function(password) {
                this.salt = this.makeSalt();
                this.setDataValue('password', this.encryptPassword(password));
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {msg: "Email field is empty"},
                isUnique: function (value, next) {
                    if (this.id && this.email === value) {
                        return next();
                    };

                    User.find({
                        where: {email: value},
                        attributes: ['id']
                    }).then(function (user) {
                        user ? next({msg: "Email is allready registered"}) : next();
                    }, next);
                }
            }
        },
        salt:            DataTypes.STRING,
        name:            DataTypes.STRING,
        phone:           DataTypes.STRING
    },{
        instanceMethods: {
            authenticate: function(plainText) {
                return this.encryptPassword(plainText) === this.password;
            },
            makeSalt: function() {
                return crypto.randomBytes(16).toString('base64');
            },
            encryptPassword: function(password) {
                if (!password || !this.salt) return '';
                var salt = new Buffer(this.salt, 'base64');
                return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
            }
        },
        classMethods: {
            associate: function(models) {
                User.hasMany(models.product);
            }
        },
        timestamps: false
    });

    return User;
};