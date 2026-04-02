-- Procedure cards for "How I Do It" community feature
CREATE TABLE IF NOT EXISTS procedure_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  procedure_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  supplies JSONB DEFAULT '[]',
  steps JSONB DEFAULT '[]',
  pearls JSONB DEFAULT '[]',
  display_name TEXT DEFAULT 'Anonymous',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE procedure_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cards" ON procedure_cards
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own cards" ON procedure_cards
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own cards" ON procedure_cards
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own cards" ON procedure_cards
  FOR DELETE USING (auth.uid()::text = user_id);
