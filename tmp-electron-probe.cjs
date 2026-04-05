const electron = require("electron");

console.log("typeof", typeof electron);
console.log("keys", electron && typeof electron === "object" ? Object.keys(electron) : []);
console.log("app", electron && electron.app);
process.exit(0);
