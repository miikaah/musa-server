import { fork } from "child_process";
import { files, albumCollection } from "./";

export const startScanner = () => {
  const scanner = fork("src/scanner.ts");

  scanner.send({ files, albumCollection });

  scanner.on("error", (err) => {
    console.error("Failed during scan:", err);
  });
};
