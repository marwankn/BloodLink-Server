/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("requests", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("patient_name");
    table.string("blood_type_needed");
    table.integer("number_of_donors_needed");
    table.integer("donors_reponded");
    table.integer("donors_donated");
    table.string("address");
    table.decimal(12, 9)("latitude");
    table.decimal(12, 9)("longitude");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("requests");
};
