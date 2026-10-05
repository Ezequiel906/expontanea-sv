import { Router } from "express";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import mariadb from "mariadb";
import net from "node:net";

const router = Router();
const AIVEN_HOST = "mysql-8e3b49c-kima-9798.c.aivencloud.com";
const AIVEN_PORT = 10954;
const CONNECTION_TIMEOUT_MS = 10_000;

const checkTcpConnection = () =>
  new Promise<void>((resolve, reject) => {
    const socket = net.createConnection({
      host: AIVEN_HOST,
      port: AIVEN_PORT,
    });

    const close = () => {
      socket.removeAllListeners();
      socket.destroy();
    };

    socket.setTimeout(CONNECTION_TIMEOUT_MS);
    socket.once("connect", () => {
      close();
      resolve();
    });
    socket.once("timeout", () => {
      close();
      reject(new Error("TCP_TIMEOUT"));
    });
    socket.once("error", () => {
      close();
      reject(new Error("TCP_CONNECTION_ERROR"));
    });
  });

const getSafeErrorCode = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string" &&
    /^[A-Z0-9_]+$/.test(error.code)
  ) {
    return error.code;
  }

  return "CONNECTION_FAILED";
};

const createMysqlConnection = () => {
  const databaseUrlValue = process.env.DATABASE_URL;

  if (!databaseUrlValue) {
    throw new Error("DATABASE_URL_MISSING");
  }

  const databaseUrl = new URL(databaseUrlValue);
  const sslMode = databaseUrl.searchParams.get("ssl-mode");
  const usesTls = Boolean(
    sslMode && sslMode.toUpperCase() !== "DISABLED"
  );

  return mariadb.createConnection({
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port || 3306),
    user: decodeURIComponent(databaseUrl.username),
    password: decodeURIComponent(databaseUrl.password),
    database: databaseUrl.pathname.slice(1),
    ssl: usesTls ? { rejectUnauthorized: false } : undefined,
    connectTimeout: CONNECTION_TIMEOUT_MS,
  });
};

router.get("/db-connection", async (_req, res) => {
  try {
    await checkTcpConnection();
  } catch {
    res.status(503).json({
      tcp: "error",
      message: "No se pudo establecer la conexión TCP.",
    });
    return;
  }

  try {
    const connection = await createMysqlConnection();
    await connection.end();
  } catch (error) {
    res.status(503).json({
      tcp: "ok",
      mysql: "error",
      code: getSafeErrorCode(error),
    });
    return;
  }

  let prisma: PrismaClient | undefined;

  try {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

    prisma = new PrismaClient({
      adapter,
    });

    await prisma.$connect();
    await prisma.$disconnect();

    res.json({
      tcp: "ok",
      mysql: "ok",
      prisma: "ok",
    });
  } catch (error) {
    await prisma?.$disconnect().catch(() => undefined);

    res.status(503).json({
      tcp: "ok",
      mysql: "ok",
      prisma: "error",
      code: getSafeErrorCode(error),
    });
  }
});

export default router;
