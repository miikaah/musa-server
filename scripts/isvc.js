/* eslint-disable @typescript-eslint/no-var-requires */
const Service = require("node-windows").Service;

const { BACKEND_BUILD_DIR } = process.env;
const script = `${BACKEND_BUILD_DIR}/index.js`;
const service = "Musa Server";

const svc = new Service({
  name: service,
  description: "Musa HTTP Server",
  script,
  env: {
    name: "NODE_ENV",
    value: "production",
  },
});

svc.on("install", () => {
  console.log("Starting", service);
  svc.start();
});

svc.on("alreadyinstalled ", () => {
  console.log("Service already installed");
  process.exit(1);
});

svc.on("invalidinstallation  ", () => {
  console.log("Service install is invalid");
  process.exit(2);
});

svc.install();
