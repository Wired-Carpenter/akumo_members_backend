exports.up = function (knex) {
  return knex.schema.createTable("linux", function (table) {
    table.increments();
    table.string("first_name");
    table.string("last_name");
    table.string("gender");
    table.string("phone_number");
    table.string("email_address");
    table.string("home_city");
    table.string("you_are");
    table.string("info_source");
    table.string("partner");
    table.string("partner_name");
    table.boolean("billable");
    table.boolean("paid");
    table.integer("form_id").unsigned();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.foreign("form_id").references("forms.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("linux");
};
