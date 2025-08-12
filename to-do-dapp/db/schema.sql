-- create DB and tables (run in your Postgres)
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS todo_events (
  id SERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB NOT NULL,
  block_number BIGINT NOT NULL,
  tx_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- optional: quick index for fast lookup
CREATE INDEX IF NOT EXISTS idx_todo_events_name ON todo_events(event_name);
