ALTER TABLE users ADD COLUMN nudges_opted_out INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN nudges_opted_out_at DATETIME;
