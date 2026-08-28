/*
# Create students table for Learning Constellation

1. New Tables
- `students` — stores each student's psychometric assessment record.
  - `id` (text, primary key) — human-readable student code e.g. "AJ-4821".
  - `name` (text, not null) — student's display name.
  - `grade` (text, not null) — grade level e.g. "10", "11", "12".
  - `class_name` (text, not null) — class cohort e.g. "11A".
  - `answers` (jsonb) — map of question ID (1-36) to Likert response (1-5).
  - `reflection` (text) — student's self-selected support request for the semester.
  - `scores` (jsonb) — computed trait scores across 6 dimensions with mean + category.
  - `archetype` (jsonb) — the determined learner archetype object (name, symbol, tips, etc.).
  - `notes` (text, nullable) — private teacher/staff notes for the student.
  - `timestamp` (bigint) — epoch milliseconds when the assessment was completed (used for sorting).
  - `created_at` (timestamptz) — database record creation time.
  - `updated_at` (timestamptz) — last modification time.

2. Indexes
- `idx_students_class_name` — for filtering students by class cohort.
- `idx_students_timestamp` — for sorting by most recent.

3. Security
- Enable RLS on `students`.
- This is a single-tenant app with NO sign-in screen (students and teachers access via a shared passcode gate, not Supabase auth). Therefore all CRUD policies are scoped to `anon, authenticated` with `USING (true)` / `WITH CHECK (true)` — the data is intentionally shared across all users of the app.
- 4 separate policies: SELECT, INSERT, UPDATE, DELETE.
*/

CREATE TABLE IF NOT EXISTS students (
  id text PRIMARY KEY,
  name text NOT NULL,
  grade text NOT NULL,
  class_name text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  reflection text NOT NULL DEFAULT '',
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  archetype jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  timestamp bigint NOT NULL DEFAULT (EXTRACT(epoch FROM now()) * 1000)::bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_students_class_name ON students (class_name);
CREATE INDEX IF NOT EXISTS idx_students_timestamp ON students (timestamp DESC);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- SELECT: anyone (anon + authenticated) can read all student records
DROP POLICY IF EXISTS "anon_select_students" ON students;
CREATE POLICY "anon_select_students"
  ON students FOR SELECT
  TO anon, authenticated
  USING (true);

-- INSERT: anyone can create a new student record
DROP POLICY IF EXISTS "anon_insert_students" ON students;
CREATE POLICY "anon_insert_students"
  ON students FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- UPDATE: anyone can update an existing student record (e.g. teacher notes)
DROP POLICY IF EXISTS "anon_update_students" ON students;
CREATE POLICY "anon_update_students"
  ON students FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE: anyone can delete a student record (teacher dashboard removal)
DROP POLICY IF EXISTS "anon_delete_students" ON students;
CREATE POLICY "anon_delete_students"
  ON students FOR DELETE
  TO anon, authenticated
  USING (true);
