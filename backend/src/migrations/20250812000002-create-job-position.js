'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JobPositions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recruiterId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Recruiters',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      requirements: {
        type: Sequelize.STRING,
        allowNull: false
      },
      department: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      salaryRange: {
        type: Sequelize.STRING,
        allowNull: false
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
