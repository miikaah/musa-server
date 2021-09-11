exports.up = async (knex) => {
  await knex.schema.dropTable("artist");
};

exports.down = async (knex) => {
  await knex.schema.createTable("artist", (table) => {
    table.timestamp("modified_at");
    table.text("path_id").notNullable().unique();
    table.text("filename").notNullable();
    table.json("metadata");
  });
};
