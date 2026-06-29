'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Candidates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true    // optional — filled in after registration
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true    // no unique constraint — email already unique in Users
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      temporaryAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      permanentAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cvUrl: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Candidates');
  }
};
