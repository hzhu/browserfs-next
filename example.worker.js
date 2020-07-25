const BrowserFS = require("browserfs");
const fs = BrowserFS.BFSRequire("fs");

BrowserFS.configure({ fs: "WorkerFS", options: { worker: self } }, (err) => {
  if (err) throw err;

  fs.readdir("/", (err, files) => {
    if (err) throw err;

    files.forEach((file, index) => {
      fs.readFile(`/${file}`, (err, contents) => {
        if (err) throw err;

        console.log("-------- WEB WORKER: --------");
        console.log(`FILE ${index + 1}:`, file);
        console.log("CONTENT:", contents.toString());
        console.log("-----------------------------");
      });
    });
  });
});
