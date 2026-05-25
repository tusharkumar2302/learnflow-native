// Table definitions for SQLite schema.
// Applied via migrations/index.ts on first launch.

export const TABLE_COURSE_PROGRESS = "course_progress";
export const TABLE_QUIZ_HISTORY = "quiz_history";
export const TABLE_BOOKMARKS = "bookmarks";
export const TABLE_STREAKS = "streaks";
export const TABLE_DOWNLOADED_COURSES = "downloaded_courses";

export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS ${TABLE_COURSE_PROGRESS} (
    chapter_id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    current_time INTEGER DEFAULT 0,
    completed INTEGER DEFAULT 0,
    last_updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ${TABLE_QUIZ_HISTORY} (
    id TEXT PRIMARY KEY,
    quiz_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    passed INTEGER DEFAULT 0,
    submitted_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ${TABLE_BOOKMARKS} (
    chapter_id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ${TABLE_STREAKS} (
    id INTEGER PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date TEXT
  );

  CREATE TABLE IF NOT EXISTS ${TABLE_DOWNLOADED_COURSES} (
    course_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    thumbnail TEXT,
    downloaded_at TEXT NOT NULL,
    size_bytes INTEGER DEFAULT 0
  );
`;
