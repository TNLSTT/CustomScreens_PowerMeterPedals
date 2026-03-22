const fs = require("fs");
const path = require("path");

let Database;
let databaseDriverError = null;

try {
  Database = require("better-sqlite3");
} catch (error) {
  databaseDriverError = error;
}

const DEFAULT_DB_PATH = path.resolve(__dirname, "../z2_data/z2.db");
const DB_PATH = path.resolve(process.env.DB_PATH || DEFAULT_DB_PATH);
const JSON_DB_PATH = DB_PATH.replace(/\.db$/i, ".json");

let db;

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function createJsonStore() {
  function readState() {
    if (!fs.existsSync(JSON_DB_PATH)) {
      return {
        counters: { rides: 0, ride_stream: 0 },
        rides: [],
        ride_stream: [],
      };
    }

    return JSON.parse(fs.readFileSync(JSON_DB_PATH, "utf8"));
  }

  function writeState(state) {
    ensureParentDir(JSON_DB_PATH);
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(state, null, 2));
  }

  function prepare(sql) {
    const normalizedSql = sql.replace(/\s+/g, " ").trim().toUpperCase();

    return {
      all(params = {}) {
        const state = readState();

        if (normalizedSql.includes("SELECT ID, DATE, TOTAL_KJ, AVG_POWER, AVG_HR, AVG_W_PER_HR, CREATED_AT FROM RIDES")) {
          return [...state.rides].sort((left, right) => {
            const dateCompare = String(right.created_at).localeCompare(String(left.created_at));
            return dateCompare !== 0 ? dateCompare : right.id - left.id;
          });
        }

        if (normalizedSql.includes("SELECT ID, RIDE_ID, TIMESTAMP, POWER, HR, W_PER_HR FROM RIDE_STREAM WHERE RIDE_ID = @RIDE_ID")) {
          return state.ride_stream
            .filter((row) => Number(row.ride_id) === Number(params.ride_id))
            .sort((left, right) => {
              const timestampCompare = Number(left.timestamp || 0) - Number(right.timestamp || 0);
              return timestampCompare !== 0 ? timestampCompare : left.id - right.id;
            });
        }

        throw new Error(`Unsupported JSON database query: ${sql}`);
      },

      run(params = {}) {
        const state = readState();

        if (normalizedSql.startsWith("INSERT INTO RIDES")) {
          const id = ++state.counters.rides;
          state.rides.push({
            id,
            date: params.date ?? null,
            total_kj: params.total_kj ?? null,
            avg_power: params.avg_power ?? null,
            avg_hr: params.avg_hr ?? null,
            avg_w_per_hr: params.avg_w_per_hr ?? null,
            created_at: new Date().toISOString(),
          });
          writeState(state);
          return { lastInsertRowid: id };
        }

        if (normalizedSql.startsWith("INSERT INTO RIDE_STREAM")) {
          const id = ++state.counters.ride_stream;
          state.ride_stream.push({
            id,
            ride_id: params.ride_id ?? null,
            timestamp: params.timestamp ?? null,
            power: params.power ?? null,
            hr: params.hr ?? null,
            w_per_hr: params.w_per_hr ?? null,
          });
          writeState(state);
          return { lastInsertRowid: id };
        }

        throw new Error(`Unsupported JSON database statement: ${sql}`);
      },
    };
  }

  return {
    pragma() {},
    exec() {
      const state = readState();
      writeState(state);
    },
    prepare,
    transaction(fn) {
      return (...args) => fn(...args);
    },
  };
}

function ensureDatabase() {
  ensureParentDir(DB_PATH);

  if (Database) {
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

    console.log(`${dbExists ? "Using" : "Created"} SQLite database at ${DB_PATH}`);
    return db;
  }

  const jsonExists = fs.existsSync(JSON_DB_PATH);
  db = createJsonStore();
  db.exec();
  console.warn(
    `better-sqlite3 is unavailable (${databaseDriverError?.code || "load failed"}); using JSON storage at ${JSON_DB_PATH} instead.`
  );
  console.log(`${jsonExists ? "Using" : "Created"} JSON database at ${JSON_DB_PATH}`);
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
  JSON_DB_PATH,
  ensureDatabase,
  getDb,
  run,
  insert,
  all,
};
