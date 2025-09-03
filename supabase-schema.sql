-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  deck_id TEXT NOT NULL,
  user_agent TEXT,
  screen_resolution TEXT,
  viewport_size TEXT,
  browser_type TEXT,
  browser_version TEXT,
  operating_system TEXT,
  device_type TEXT, -- 'desktop', 'tablet', 'mobile'
  device_model TEXT,
  language TEXT,
  timezone TEXT,
  referrer_url TEXT,
  landing_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  ip_address INET,
  country TEXT,
  region TEXT,
  city TEXT,
  is_returning_visitor BOOLEAN DEFAULT FALSE,
  visitor_id TEXT, -- cookie-based visitor tracking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  success BOOLEAN,
  total_duration INTEGER -- milliseconds
);

-- Round attempts table  
CREATE TABLE IF NOT EXISTS round_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES game_sessions(session_id) ON DELETE CASCADE,
  deck_id TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  round_type TEXT NOT NULL, -- 'monster', 'spell', 'trap'
  cards_shown TEXT[] NOT NULL,
  correct_card_id TEXT NOT NULL,
  selected_card_id TEXT,
  selection_time INTEGER, -- milliseconds
  was_timeout BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_session_id ON game_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_deck_id ON game_sessions(deck_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_visitor_id ON game_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_country ON game_sessions(country);
CREATE INDEX IF NOT EXISTS idx_game_sessions_utm_source ON game_sessions(utm_source);
CREATE INDEX IF NOT EXISTS idx_game_sessions_is_returning ON game_sessions(is_returning_visitor);
CREATE INDEX IF NOT EXISTS idx_round_attempts_session_id ON round_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_round_attempts_deck_id ON round_attempts(deck_id);
CREATE INDEX IF NOT EXISTS idx_round_attempts_round_type ON round_attempts(round_type);

-- Analytics view
CREATE OR REPLACE VIEW deck_analytics AS
SELECT 
  deck_id,
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE success = true) as successes,
  ROUND(AVG(total_duration)) as avg_completion_ms,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) as completed_attempts
FROM game_sessions 
GROUP BY deck_id;

-- Round type analytics view
CREATE OR REPLACE VIEW round_type_analytics AS
SELECT 
  deck_id,
  round_type,
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE selected_card_id = correct_card_id) as correct_selections,
  COUNT(*) FILTER (WHERE was_timeout = true) as timeouts,
  AVG(selection_time) as avg_selection_time_ms
FROM round_attempts 
GROUP BY deck_id, round_type;

-- Insert sample data for testing (optional)
-- INSERT INTO game_sessions (session_id, deck_id, user_agent, screen_resolution) 
-- VALUES ('test-session-1', 'fairy', 'Test Browser', '1920x1080');