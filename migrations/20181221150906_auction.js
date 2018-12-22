exports.up = function(knex, Promise) {
  return new Promise(async (resolve, reject) => {
    try {
      await Promise.all([
        knex.schema.createTable("account", function(t) {
          t.string("id").primary();
          t.string("name").notNullable();
          t.string("password").notNullable();
          t.string("email").notNullable();
        }),

        knex.schema.createTable("vehicle", function(t) {
          t.increments("id").primary();
          t.string("brand").notNullable();
          t.string("model").notNullable();
          t.string("color").notNullable();
          t.string("owner_id")
            .notNullable()
            .index();
          t.integer("year").notNullable();
          t.integer("odometer").notNullable();
        }),

        knex.schema.createTable("bid", function(t) {
          t.increments("id").primary();
          t.integer("vehicle_id")
            .notNullable()
            .index();
          t.string("account_id")
            .notNullable()
            .index();
          t.string("time").notNullable();
          t.integer("price").notNullable();
        })
      ]);

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

exports.down = function(knex, Promise) {
  return new Promise(async (resolve, reject) => {
    try {
      await Promise.all([
        knex.schema.dropTableIfExists("account"),
        knex.schema.dropTableIfExists("vehicle"),
        knex.schema.dropTableIfExists("bid")
      ]);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
