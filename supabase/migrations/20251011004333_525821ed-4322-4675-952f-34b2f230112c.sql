-- Add audio_url column to journal_entries table for voice recordings
ALTER TABLE journal_entries ADD COLUMN audio_url TEXT;