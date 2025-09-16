'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Interviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      candidateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Candidates',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      scheduleDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'SCHEDULED',
      },
      feedback: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // // Drop ENUM first (important for Postgres)
    // await queryInterface.sequelize.query(
    //   'DROP TYPE IF EXISTS "enum_Interviews_status";'
    // );
    await queryInterface.dropTable('Interviews');
  },
};
