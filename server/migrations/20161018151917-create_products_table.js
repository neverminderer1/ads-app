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
        user_id:{
            type:           Sequelize.INTEGER,
            allowNull:      false,
            references: {
              model:        "users",
              key:          "id"
            },
            onUpdate:       "CASCADE",
            onDelete:       "CASCADE"
        }
    });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('products');
    }
};