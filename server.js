const http = require("http");
const fs = require("fs");
const path = require("path");
const { ensureDatabase, getDb, insert, all } = require("./db");

const PORT = 8000;
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

async function handleApiRequest(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/rides") {
    try {
      const rides = all(`
        SELECT id, date, total_kj, avg_power, avg_hr, avg_w_per_hr, created_at
        FROM rides
        ORDER BY datetime(created_at) DESC, id DESC
      `);
      sendJson(res, 200, rides);
    } catch (error) {
      console.error("Failed to fetch rides:", error);
      sendJson(res, 500, { error: "Failed to fetch rides" });
    }
    return true;
  }

  if (req.method === "GET" && /^\/api\/rides\/\d+\/stream$/.test(pathname)) {
    try {
      const rideId = Number(pathname.split("/")[3]);
      const rows = all(
        `SELECT id, ride_id, timestamp, power, hr, w_per_hr
         FROM ride_stream
         WHERE ride_id = @ride_id
         ORDER BY timestamp ASC, id ASC`,
        { ride_id: rideId }
      );
      sendJson(res, 200, rows);
    } catch (error) {
      console.error("Failed to fetch ride stream:", error);
      sendJson(res, 500, { error: "Failed to fetch ride stream" });
    }
    return true;
  }

  if (req.method === "POST" && pathname === "/api/rides") {
    try {
      const body = await readJsonBody(req);
      const result = insert(
        `INSERT INTO rides (date, total_kj, avg_power, avg_hr, avg_w_per_hr)
         VALUES (@date, @total_kj, @avg_power, @avg_hr, @avg_w_per_hr)`,
        {
          date: body.date || null,
          total_kj: body.total_kj ?? null,
          avg_power: body.avg_power ?? null,
          avg_hr: body.avg_hr ?? null,
          avg_w_per_hr: body.avg_w_per_hr ?? null,
        }
      );

      sendJson(res, 201, { id: result.lastInsertRowid });
    } catch (error) {
      console.error("Failed to insert ride:", error);
      sendJson(res, 500, { error: "Failed to insert ride" });
    }
    return true;
  }

  if (req.method === "POST" && pathname === "/api/ride-stream") {
    try {
      const body = await readJsonBody(req);
      const rows = Array.isArray(body) ? body : Array.isArray(body.rows) ? body.rows : [body];
      const db = getDb();
      const insertRideStream = db.prepare(
        `INSERT INTO ride_stream (ride_id, timestamp, power, hr, w_per_hr)
         VALUES (@ride_id, @timestamp, @power, @hr, @w_per_hr)`
      );
      const insertMany = db.transaction((streamRows) => {
        for (const row of streamRows) {
          insertRideStream.run({
            ride_id: row.ride_id ?? null,
            timestamp: row.timestamp ?? null,
            power: row.power ?? null,
            hr: row.hr ?? null,
            w_per_hr: row.w_per_hr ?? null,
          });
        }
      });

      insertMany(rows);
      sendJson(res, 201, { inserted: rows.length });
    } catch (error) {
      console.error("Failed to insert ride stream:", error);
      sendJson(res, 500, { error: "Failed to insert ride stream" });
    }
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (requestUrl.pathname.startsWith("/api/")) {
    const handled = await handleApiRequest(req, res, requestUrl.pathname);

    if (!handled) {
      sendJson(res, 404, { error: "Not found" });
    }
    return;
  }

  const requestPath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = path.join(ROOT, requestPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === "ENOENT" ? 404 : 500, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      res.end(err.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    const ext = path.extname(filePath);
    const type = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});

ensureDatabase();

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
