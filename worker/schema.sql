CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rider_name TEXT NOT NULL,
  style_id TEXT NOT NULL,
  country_code TEXT NOT NULL,
  wins INTEGER NOT NULL,
  podiums INTEGER NOT NULL,
  stage_wins INTEGER NOT NULL DEFAULT 0,
  final_reputation INTEGER NOT NULL,
  seasons INTEGER NOT NULL,
  best_rank INTEGER,
  score INTEGER NOT NULL,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_style_score ON leaderboard(style_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_country_score ON leaderboard(country_code, score DESC);

CREATE TABLE IF NOT EXISTS rate_limit (
  ip TEXT PRIMARY KEY,
  last_submit TEXT NOT NULL
);
