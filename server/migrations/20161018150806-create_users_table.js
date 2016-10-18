'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('users', {
            id: {
                allowNull:      false,
                autoIncrement:  true,
                primaryKey:     true,
                type:           Sequelize.INTEGER
            },
            name:               Sequelize.STRING,
            email: {
                type:           Sequelize.STRING,
                allowNull:      false
            },
            password:           Sequelize.STRING,
            phone:              Sequelize.STRING,
            salt:               Sequelize.STRING
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('users');
  }
};