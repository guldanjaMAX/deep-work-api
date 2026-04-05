CREATE TABLE IF NOT EXISTS nudges (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_email TEXT,
  nudge_type TEXT NOT NULL,
  sent_at DATETIME NOT NULL,
  bounced INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0,
  opened_at DATETIME
);
CREATE INDEX IF NOT EXISTS idx_nudges_session ON nudges(session_id);
CREATE INDEX IF NOT EXISTS idx_nudges_email ON nudges(user_email);
