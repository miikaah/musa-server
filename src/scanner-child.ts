import { fork } from "child_process";
import { files } from "./";

export const startScanner = () => {
  const scanner = fork("src/scanner.ts");

  scanner.send({ files });

  scanner.on("error", (err) => {
    console.error("Failed to start scanner:", err);
  });
};
