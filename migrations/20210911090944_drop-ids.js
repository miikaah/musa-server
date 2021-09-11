exports.up = async (knex) => {
  await knex.schema.table("artist", (table) => {
    table.dropColumn("id");
  });
  await knex.schema.table("album", (table) => {
    table.dropColumn("id");
  });
  await knex.schema.table("audio", (table) => {
    table.dropColumn("id");
  });
};

exports.down = async () => undefined;
