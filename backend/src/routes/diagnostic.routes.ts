import { Router } from "express";
import net from "node:net";

const router = Router();
const AIVEN_HOST = "mysql-8e3b49c-kima-9798.c.aivencloud.com";
const AIVEN_PORT = 10954;
const CONNECTION_TIMEOUT_MS = 10_000;

router.get("/db-connection", (_req, res) => {
  const socket = net.createConnection({
    host: AIVEN_HOST,
    port: AIVEN_PORT,
  });

  let completed = false;

  const finish = (status: number, body: Record<string, string>) => {
    if (completed) {
      return;
    }

    completed = true;
    socket.destroy();
    res.status(status).json(body);
  };

  socket.setTimeout(CONNECTION_TIMEOUT_MS);

  socket.once("connect", () => {
    finish(200, { tcp: "ok" });
  });

  socket.once("timeout", () => {
    finish(503, {
      tcp: "error",
      message: "La conexión TCP expiró.",
    });
  });

  socket.once("error", () => {
    finish(503, {
      tcp: "error",
      message: "No se pudo establecer la conexión TCP.",
    });
  });
});

export default router;
