exports.up = function (knex) {
  return knex.schema.createTable("members", function (table) {
    table.increments();
    table.string("first_name");
    table.string("last_name");
    table.string("email_address");
    table.boolean("status");
    table.boolean("slack");
    table.boolean("teachable");
    table.boolean("linux");
    table.boolean("aws");
    table.boolean("ansible");
    table.boolean("terraform");
    table.boolean("git");
    table.boolean("cloudformation");
    table.boolean("career_coaching");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("members");
};
