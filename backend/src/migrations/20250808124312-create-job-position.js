'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JobPositions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      requirements: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      salaryRange: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('open', 'closed'),
        allowNull: false,
        defaultValue: 'open'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('JobPositions');
  }
};