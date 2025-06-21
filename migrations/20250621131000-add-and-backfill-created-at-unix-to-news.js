"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add the column as nullable
    await queryInterface.addColumn("news", "created_at_unix", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
    // 2. Backfill using created_at
    await queryInterface.sequelize.query(
      `UPDATE news SET created_at_unix = EXTRACT(EPOCH FROM created_at)::BIGINT`
    );
    // 3. Set NOT NULL
    await queryInterface.changeColumn("news", "created_at_unix", {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
    // 4. Add index
    await queryInterface.addIndex("news", ["created_at_unix"], {
      name: "news_created_at_unix_idx",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("news", "news_created_at_unix_idx");
    await queryInterface.removeColumn("news", "created_at_unix");
  },
};
