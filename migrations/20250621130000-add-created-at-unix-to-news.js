"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("news", "created_at_unix", {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: Math.floor(Date.now() / 1000),
    });
    await queryInterface.addIndex("news", ["created_at_unix"], {
      name: "news_created_at_unix_idx",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("news", "news_created_at_unix_idx");
    await queryInterface.removeColumn("news", "created_at_unix");
  },
};
