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
      queryInterface.addColumn('reflections', 'fullText', {
        type: Sequelize.TEXT,
        allowNull: false
      }),
      queryInterface.addColumn('reflections', 'source', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.renameColumn('reflections', 'text', 'verse')
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
      queryInterface.removeColumn('reflections', 'fullText'),
      queryInterface.removeColumn('reflections', 'source'),
      queryInterface.renameColumn('reflections', 'verse', 'text')
    ]
  }
};
