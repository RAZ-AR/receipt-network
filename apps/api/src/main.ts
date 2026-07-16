// Beleg API — modular monolith entrypoint (ADR-P-007).
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./router.js";
import { createContext } from "./trpc.js";

const PORT = Number(process.env.PORT ?? 4000);

const server = createHTTPServer({
  router: appRouter,
  createContext,
  // Dev only: the Expo app calls this from a phone on the same network.
  middleware: (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      return res.end();
    }
    // tRPC has no root route, so opening the base URL in a browser returns a
    // "No query-procedure on path" error that reads like a fault. Answer with
    // something legible instead.
    if (req.url === "/" || req.url === "") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify(
          {
            service: "beleg-api",
            ok: true,
            hint: "tRPC endpoints live on named paths, e.g. /health",
            endpoints: ["/health", "/wallet.get", "/receiptsHistory.list", "/receipts.submit (POST)"],
          },
          null,
          2
        )
      );
    }
    next();
  },
});

server.listen(PORT);
// Bind on all interfaces so a physical device can reach it over the LAN.
console.log(`Beleg API on http://0.0.0.0:${PORT}`);
