/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("profile", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("first_name");
    table.string("last_name");
    table.integer("phone_number");
    table.string("address");
    table.string("sex").notNullable().checkIn(["m", "f"]);
    table.string("blood_type").notNullable();
    table.date("last_donation").notNullable();
    table.integer("number_of_donations");
    table.float("travel_radius_for_donation");
    table.decimal("latitude", 12, 9);
    table.decimal("longitude", 12, 9);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("profile");
};
