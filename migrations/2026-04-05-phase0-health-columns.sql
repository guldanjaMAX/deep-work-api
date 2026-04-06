ALTER TABLE sessions ADD COLUMN tier_title TEXT;
ALTER TABLE sessions ADD COLUMN session_health TEXT;
ALTER TABLE sessions ADD COLUMN health_updated_at DATETIME;
CREATE INDEX IF NOT EXISTS idx_sessions_health ON sessions(session_health);
CREATE INDEX IF NOT EXISTS idx_sessions_tier ON sessions(tier_title);
