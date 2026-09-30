// Petit serveur local : node serve.js  ->  http://localhost:5173
// Sur le même Wi-Fi, le téléphone peut ouvrir l'adresse "Réseau" affichée au démarrage.
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const PORT = process.env.PORT || 5173, ROOT = __dirname;
const TYPES = { ".html": "text/html; charset=utf-8", ".json": "application/json; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml" };

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(ROOT, url === "/" ? "index.html" : url);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end("Introuvable"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(buf);
  });
}).listen(PORT, "0.0.0.0", () => {
  console.log(`Local  : http://localhost:${PORT}`);
  for (const nets of Object.values(os.networkInterfaces()))
    for (const n of nets || []) if (n.family === "IPv4" && !n.internal) console.log(`Réseau : http://${n.address}:${PORT}`);
});
