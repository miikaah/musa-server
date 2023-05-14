/* eslint-disable @typescript-eslint/no-var-requires */
const Service = require("node-windows").Service;

const { BACKEND_BUILD_DIR } = process.env;
const script = `${BACKEND_BUILD_DIR}/index.js`;
const service = "Musa Server";

const svc = new Service({
  name: service,
  script,
});

svc.on("uninstall", function () {
  console.log(`Uninstall complete. Service exists: ${svc.exists}.`);
});

svc.uninstall();
