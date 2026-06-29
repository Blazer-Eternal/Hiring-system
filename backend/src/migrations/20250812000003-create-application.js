'use strict';

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
          model: 'Candidates',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      jobId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'JobPositions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      interviewId: {
        type: Sequelize.INTEGER,
        allowNull: true
        // FK added after Interviews table is created (see migration 20250811082848)
      },
      status: {
        type: Sequelize.ENUM('applied', 'under_review', 'interview', 'hired', 'rejected'),
        allowNull: false,
        defaultValue: 'applied'
      },
      matchScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
        comment: 'TF-IDF cosine similarity score 0-100'
      },
      matchedKeywords: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
        comment: 'Keywords matched between CV and job requirements'
      },
      cvSnapshot: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'CV text at time of application'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Applications');
  }
};
