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
            allowNull: false
        },
        price:           DataTypes.FLOAT,
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