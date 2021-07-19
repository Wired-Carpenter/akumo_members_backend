// Update with your config settings.

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      database: "akumo_members_dev",
      user: "root",
      password: "root",
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      directory: "./db/migrations",
      tableName: "knex_migrations",
    },
  },
};
