exports.up = async (knex) => {
  await knex.schema.createTable("album", (table) => {
    table.increments("id");
    table.timestamp("modified_at");
    table.text("path_id").notNullable().unique();
    table.text("filename").notNullable();
    table.json("metadata");
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable("album");
};
