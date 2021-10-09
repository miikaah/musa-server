exports.up = async (knex) => {
  await knex.schema.createTable("theme", (table) => {
    table.timestamp("modified_at");
    table.text("path_id").notNullable().unique();
    table.text("filename").notNullable();
    table.json("colors");
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable("theme");
};
