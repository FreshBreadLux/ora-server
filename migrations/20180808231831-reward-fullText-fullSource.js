'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return [
      queryInterface.addColumn('rewards', 'fullText', {
        type: Sequelize.TEXT,
        allowNull: false
      }),
      queryInterface.addColumn('rewards', 'fullSource', {
        type: Sequelize.STRING,
        allowNull: false
      })
    ]
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return [
      queryInterface.removeColumn('rewards', 'fullText'),
      queryInterface.removeColumn('rewards', 'fullSource')
    ]
  }
};
