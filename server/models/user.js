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
            allowNull: true,
            validate: {
                notEmpty: { msg: 'Введите пароль' },
            },
            set: function(password) {
                this.salt = this.makeSalt();
                this.setDataValue('password', this.encryptPassword(password));
            }
        },
        salt:            DataTypes.STRING,
        email:           DataTypes.STRING,
        name:            DataTypes.STRING,
        phone:           DataTypes.STRING,
        createdAt:       DataTypes.DATE,
        updatedAt:       DataTypes.DATE
    },{
        instanceMethods: {
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
        }
    });

    return User;
};