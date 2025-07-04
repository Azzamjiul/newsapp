'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'notificationsEnabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'notificationsEnabled');
  },
};
