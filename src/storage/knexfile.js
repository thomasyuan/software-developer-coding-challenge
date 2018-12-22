// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./auction.sqlite3"
    },
    debug: false,
    useNullAsDefault: true
  },

  production: {
    client: "postgresql",
    connection: {
      database: "postgres",
      user: "postgres",
      password: "password",
      host: process.env.DB_HOST || "localhost"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};
