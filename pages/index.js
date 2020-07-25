import Head from "next/head";
import Worker from "../example.worker";

const BrowserFS = require("browserfs");

export default function Home() {
  const fsRef = React.useRef();
  const [text, setText] = React.useState("");
  const [filename, setFilename] = React.useState("");

  const readFromBrowser = () => {
    fsRef.current.readdir("/", (err, files) => {
      if (err) throw err;

      files.forEach((file, index) => {
        fsRef.current.readFile(`/${file}`, (err, contents) => {
          if (err) {
            throw err;
          }

          console.log("------ BROWSER THREAD: ------");
          console.log(`FILE ${index + 1}:`, file);
          console.log("CONTENT:", contents.toString());
          console.log("-----------------------------");
        });
      });
    });
  };

  const readFromWorker = () => {
    const webWorkerObject = new Worker();
    BrowserFS.FileSystem.WorkerFS.attachRemoteListener(webWorkerObject);
  };

  const writeToFS = () => {
    fsRef.current.writeFile(filename, text, "utf8", (err) => {
      if (err) {
        throw err;
      } else {
        console.log(`Successfully written to /${filename}.`);
      }
    });
  };

  React.useEffect(() => {
    BrowserFS.install(window);
    BrowserFS.configure({ fs: "LocalStorage" }, (err) => {
      if (err) {
        throw err;
      } else {
        fsRef.current = window.require("fs");
      }
    });
  }, []);

  return (
    <form>
      <fieldset style={{ marginBottom: "12px" }}>
        <legend>Write content to a file</legend>
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="file-name">File name:</label>
          <input
            id="file-name"
            type="text"
            value={filename}
            placeholder="e.g. filename.txt"
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>
        <div style={{ display: "flex" }}>
          <label htmlFor="file-contents">File contents:</label>
          <textarea
            id="file-contents"
            value={text}
            placeholder='e.g. "Hello World!"'
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </fieldset>
      <button
        type="button"
        disabled={filename === "" || text === ""}
        onClick={writeToFS}
      >
        Write to FS
      </button>
      <button type="button" onClick={readFromBrowser}>
        Read from browser thread
      </button>
      <button type="button" onClick={readFromWorker}>
        Read from web worker
      </button>
    </form>
  );
}
