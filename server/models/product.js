'use strict';

module.exports = function(sequelize, DataTypes) {
    var Product = sequelize.define('product', {
        id:    {
            type:      DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Title field is empty" },
                len:      { args: [3,16], msg: 'Title must be between 3 and 16 characters in length' }
            }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Price field is empty" }
            }
        },
        image:           DataTypes.STRING,
        userId:          DataTypes.INTEGER,
        createdAt:       DataTypes.DATE,
        updatedAt:       DataTypes.DATE
    },{
        classMethods: {
            associate: function (models) {
                Product.belongsTo(models.user);
            }
        }
    });

    return Product;
};