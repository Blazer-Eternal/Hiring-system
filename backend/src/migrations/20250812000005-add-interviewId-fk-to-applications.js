'use strict';

// Adds the FK constraint for interviewId on Applications after Interviews table exists.
// Applications and Interviews have a circular reference so the FK must be added post-creation.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Applications', {
      fields: ['interviewId'],
      type: 'foreign key',
      name: 'fk_applications_interviewId',
      references: {
        table: 'Interviews',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Applications', 'fk_applications_interviewId');
  }
};
