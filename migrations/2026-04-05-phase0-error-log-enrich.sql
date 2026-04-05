ALTER TABLE error_log ADD COLUMN session_id TEXT;
ALTER TABLE error_log ADD COLUMN user_email TEXT;
CREATE INDEX IF NOT EXISTS idx_error_log_session ON error_log(session_id);
