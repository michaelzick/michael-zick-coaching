-- Rename "How to Speak Womanese" and add course-level completion tracking

SET search_path TO public;

-- Rename the course
UPDATE courses
SET title = 'How To Speak Womanese And Handle Conflict Like A Champ',
    slug = 'how-to-speak-womanese-and-handle-conflict-like-a-champ'
WHERE id = '00000000-0000-0000-0000-000000000010';

-- Add completed_at column to enrollments for course-level completion tracking
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NULL;
