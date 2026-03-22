const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const DEFAULT_DB_PATH = path.resolve(__dirname, "../z2_data/z2.db");
const DB_PATH = path.resolve(process.env.DB_PATH || DEFAULT_DB_PATH);

let db;

function ensureDatabase() {
  const dbDir = path.dirname(DB_PATH);
  fs.mkdirSync(dbDir, { recursive: true });

  const dbExists = fs.existsSync(DB_PATH);
  db = new Database(DB_PATH);
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      total_kj REAL,
      avg_power REAL,
      avg_hr REAL,
      avg_w_per_hr REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ride_stream (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ride_id INTEGER,
      timestamp INTEGER,
      power REAL,
      hr REAL,
      w_per_hr REAL,
      FOREIGN KEY (ride_id) REFERENCES rides(id)
    );
  `);

  console.log(
    `${dbExists ? "Using" : "Created"} SQLite database at ${DB_PATH}`
  );

  return db;
}

function getDb() {
  if (!db) {
    return ensureDatabase();
  }

  return db;
}

function run(sql, params = {}) {
  return getDb().prepare(sql).run(params);
}

function insert(sql, params = {}) {
  return run(sql, params);
}

function all(sql, params = {}) {
  return getDb().prepare(sql).all(params);
}

module.exports = {
  DB_PATH,
  ensureDatabase,
  getDb,
  run,
  insert,
  all,
};
