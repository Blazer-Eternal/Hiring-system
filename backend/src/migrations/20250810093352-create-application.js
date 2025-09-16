'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      candidateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Candidates",
          key: "id",
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      jobId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "JobPositions",
          key: "id",
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
       interviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Interviews",
          key: "id",
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM(
          'APPLIED',
          'UNDER_REVIEW',
          'INTERVIEW',
          'HIRED',
          'REJECTED'
        )
      },
     createdAt: {
       type: Sequelize.DATE,
       allowNull: false,
       defaultValue: Sequelize.NOW, 
     },
     updatedAt: {
       type: Sequelize.DATE,
       allowNull: false,
       defaultValue: Sequelize.NOW, 
     },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Applications');
  }
};
