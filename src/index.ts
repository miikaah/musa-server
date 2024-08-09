import { execSync } from "child_process";
import { Server } from "http";
import { errorHandler } from "./errorHandler";
import { app } from "./express";
import { logger } from "./logger";
import { Db, Scanner } from "./musa-core-import";
import { setImageCollection } from "./repo";

export * from "./api/album";
export * from "./api/artist";
export * from "./api/audio";
export * from "./api/file";
export * from "./api/find";
export * from "./api/genre";
export * from "./api/image";
export * from "./api/playlist";
export * from "./api/settings";
export * from "./api/static";
export * from "./api/theme";
export { app } from "./express";

const {
  NODE_ENV = "",
  MUSA_SRC_PATH = "",
  PORT = 4200,
  MUSA_BASE_URL = "",
  TAILSCALE_TAILNET = "",
  TAILSCALE_OAUTH_CLIENT_ID = "",
  TAILSCALE_OAUTH_CLIENT_SECRET = "",
} = process.env;

const baseUrl = `${MUSA_BASE_URL}:${PORT}`;
const musicLibraryPath = MUSA_SRC_PATH;

let server: Server | undefined;

export const start = async () => {
  app.use(errorHandler);

  if (NODE_ENV === "test" && !process.env.FORCE_SERVER_START) {
    return;
  }

  logger.log(`\n${new Date().toISOString()}\n`);
  await Db.init(musicLibraryPath);
  const mediaCollection = await Scanner.init({
    musicLibraryPath,
    baseUrl,
    isElectron: false,
    artistUrlFragment: "artists",
    albumUrlFragment: "albums",
    audioUrlFragment: "audios",
    imageUrlFragment: "images",
    fileUrlFragment: "files",
  });
  setImageCollection(mediaCollection.imageCollection || {});

  server = app.listen(PORT, async () => {
    if (NODE_ENV !== "test") {
      logger.log(`Serving ${baseUrl}\n`);
    }

    await Scanner.update({ musicLibraryPath });
  });

  /**
   * Tailscale v1.70.0 or some version earlier during summer 2024 started connecting
   * very slowly from new nodes and long stale old nodes leading to timeouts.
   * This code mitigates that degradation.
   *
   * Help Tailscale set up a new ephemeral connections (to fly.io)
   * by parsing the result of "tailscale status" by filtering out active and offline conns.
   * This leaves "-" status which means a new node and "idle". It's ok to ping idle,
   * it just gets set to active. Fly.io closes correctly even in this case and the status
   * goes to "idle; offline" which gets filtered out.
   */
  if (TAILSCALE_TAILNET && TAILSCALE_OAUTH_CLIENT_ID && TAILSCALE_OAUTH_CLIENT_SECRET) {
    setInterval(async () => {
      let linuxIps: string[] = [];
      try {
        const musaIp = MUSA_BASE_URL.split("://")[1];
        const status = execSync("tailscale status").toString().split("\n");
        linuxIps = status
          .filter(
            (s) =>
              s.includes("linux") &&
              !s.includes("active") &&
              !s.includes("offline") &&
              !s.includes(musaIp),
          )
          .flatMap((s) => s.split(" ")[0]);
      } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.log("Failed to get Tailscale status", message);
      }

      linuxIps.forEach((linuxIp) => {
        try {
          const stdout = execSync(`tailscale ping --c 1 ${linuxIp}`);
          console.log(`Response from tailscale device: ${stdout}`);
        } catch (error) {
          const message = error instanceof Error ? error.message : JSON.stringify(error);
          if (!message.startsWith("Command failed: tailscale ping")) {
            console.error("Failed to ping tailscale device", message);
          }
        }
      });
    }, 10_000);
  }
};

void start();

process.on("SIGTERM", () => {
  logger.log("Received SIGTERM, shutting down gracefully...");

  server?.close(() => {
    logger.log("HTTP server closed");
  });

  logger.log("Shutting down process");
  process.exit(0);
});
