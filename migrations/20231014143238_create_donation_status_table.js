/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("donation_status", function (table) {
    table.increments("id").primary();
    table.integer("request_id").unsigned().references("requests.id");
    table.integer("user_id").unsigned().references("users.id");
    table.boolean("donor_responded").defaultTo(false);
    table.boolean("donor_donated").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("donation_status");
};
