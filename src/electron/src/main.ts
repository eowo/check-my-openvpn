import { app, BrowserWindow } from "electron";
import * as os from "os";
import * as path from "path";
import { env } from "process";
import { format as formatUrl } from "url";

if (env.NODE_ENV === "development") {
  runElectronReload();
}

let mainWindow: Electron.BrowserWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.loadURL(
    formatUrl({
      pathname: path.join(__dirname + "/index.html"),
      protocol: "file",
      slashes: true
    })
  );

  window.on("closed", () => {
    mainWindow = null;
  });

  if (env.NODE_ENV === "development" && env.REACT_EXTENSION_DIR) {
    runReactExtension();
  }

  return window;
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

app.on("ready", () => {
  mainWindow = createMainWindow();
});

function runReactExtension() {
  BrowserWindow.addDevToolsExtension(
    path.join(os.homedir(), env.REACT_EXTENSION_DIR)
  );
}

function runElectronReload() {
  require("electron-reload")(__dirname);
}
