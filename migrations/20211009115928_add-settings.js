exports.up = async (knex) => {
  await knex.schema.createTable("settings", (table) => {
    table.increments("id");
    table.timestamp("modified_at");
    table.text("user_id").notNullable().unique();
    table.json("json");
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable("settings");
};
