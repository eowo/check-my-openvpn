import { app, BrowserWindow } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";

let mainWindow: Electron.BrowserWindow;

function createMainWindow() {
  const window = new BrowserWindow();

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
