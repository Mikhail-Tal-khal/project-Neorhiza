/**
 * Minimal webhook receiver used by the e2e suite as a real delivery target
 * for the contact form. GET /received lists what arrived; DELETE clears it.
 */
import { createServer } from "node:http";

const port = Number(process.env.SINK_PORT ?? 4599);
let received = [];

createServer((req, res) => {
  if (req.method === "POST" && req.url === "/hook") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      received.push({ auth: req.headers.authorization ?? null, body: JSON.parse(body) });
      res.writeHead(204).end();
    });
    return;
  }
  if (req.url === "/received") {
    if (req.method === "DELETE") received = [];
    res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(received));
    return;
  }
  if (req.url === "/health") return res.writeHead(200).end("ok");
  res.writeHead(404).end();
}).listen(port, "127.0.0.1", () => console.log(`webhook sink on ${port}`));
