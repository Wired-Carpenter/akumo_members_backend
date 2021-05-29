require("dotenv").config();

const migrate = async () => {
  console.log("Migration started.");
  const knex = require("knex")({
    client: "mysql2",
    connection: {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
  });
  await knex.schema.createTable("members", (table) => {
    table.increments();
    table.string("first_name");
    table.string("last_name");
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
  console.log("Migration done");
  process.exit(0);
};

if (require.main === module) {
  migrate();
}
