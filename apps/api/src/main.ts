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
    next();
  },
});

server.listen(PORT);
// Bind on all interfaces so a physical device can reach it over the LAN.
console.log(`Beleg API on http://0.0.0.0:${PORT}`);
