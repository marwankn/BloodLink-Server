exports.up = function (knex) {
  return knex.schema.raw(`
  CREATE TRIGGER update_donors_responded
  AFTER INSERT ON donation_status
  FOR EACH ROW
  BEGIN
    UPDATE requests
    SET donors_responded = (SELECT COUNT(*) FROM donation_status WHERE request_id = NEW.request_id AND donor_responded = 1)
    WHERE id = NEW.request_id;
  END;
  `).raw(`
  CREATE TRIGGER update_donors_donated
  AFTER INSERT ON donation_status
  FOR EACH ROW
  BEGIN
    UPDATE requests
    SET donors_donated = (SELECT COUNT(*) FROM donation_status WHERE request_id = NEW.request_id AND donor_donated = 1)
    WHERE id = NEW.request_id;
  END;
  `);
};

exports.down = function (knex) {
  return knex.schema.raw(`
    DROP TRIGGER IF EXISTS update_donors_responded;
  `).raw(`
  DROP TRIGGER IF EXISTS update_donors_donated;
`);
};
