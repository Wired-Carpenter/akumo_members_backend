exports.up = function (knex) {
  return knex.schema.createTable("forms", function (table) {
    table.increments();
    table.string("title");
    table.enu("type", ["linux"]);
    table.datetime("start_date");
    table.datetime("end_date");
    table.enu("status", ["active", "inactive"]);
    table.string("token");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("forms");
};
