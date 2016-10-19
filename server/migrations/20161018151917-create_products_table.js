'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('products', {
        id: {
            allowNull:      false,
            autoIncrement:  true,
            primaryKey:     true,
            type:           Sequelize.INTEGER
        },
        title: {
            type:           Sequelize.STRING,
        allowNull:      false
        },
        price:              Sequelize.FLOAT,
        image:              Sequelize.STRING,
        userId:{
            type:           Sequelize.INTEGER,
            allowNull:      false,
            references: {
              model:        "users",
              key:          "id"
            },
            onUpdate:       "CASCADE",
            onDelete:       "CASCADE"
        },
        createdAt: {
            allowNull:      false,
            type:           Sequelize.DATE
        },
        updatedAt: {
            allowNull:      false,
            type:           Sequelize.DATE
        }
    });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('products');
    }
};