const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8000;
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const requestPath = req.url === "/" ? "/index.html" : req.url;
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

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
