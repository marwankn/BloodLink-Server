exports.up = function (knex) {
  return knex.schema.raw(`
      CREATE TRIGGER update_donors_responded
      AFTER INSERT ON donation_status
      FOR EACH ROW
      BEGIN
        UPDATE requests
        SET donors_responded = donors_responded + 1
        WHERE id = NEW.request_id;
      END;
    `).raw(`
      CREATE TRIGGER update_donors_responded_reverse
      BEFORE UPDATE ON donation_status
      FOR EACH ROW
      BEGIN
        IF NEW.donor_donated = FALSE AND OLD.donor_donated = TRUE THEN
          UPDATE requests
          SET donors_responded = donors_responded - 1
          WHERE id = NEW.request_id;
        END IF;
      END;
    `).raw(`
      CREATE TRIGGER update_donors_donated
      AFTER INSERT ON donation_status
      FOR EACH ROW
      BEGIN
        IF NEW.donor_donated = TRUE THEN
          UPDATE requests
          SET donors_donated = donors_donated + 1
          WHERE id = NEW.request_id;
        END IF;
      END;
    `).raw(`
      CREATE TRIGGER update_donors_donated_reverse
      BEFORE UPDATE ON donation_status
      FOR EACH ROW
      BEGIN
        IF NEW.donor_donated = FALSE AND OLD.donor_donated = TRUE THEN
          UPDATE requests
          SET donors_donated = donors_donated - 1
          WHERE id = NEW.request_id;
        END IF;
      END;
    `);
};

exports.down = function (knex) {
  // You can define the down function if needed to drop the triggers.
};
