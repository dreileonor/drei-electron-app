"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  setMouseIgnore: (ignore, options) => electron.ipcRenderer.send("set-mouse-ignore", ignore, options),
  openExternal: (url) => electron.ipcRenderer.send("open-external", url),
  openPlayer: (url) => electron.ipcRenderer.send("open-player", url),
  scrapeStream: (title) => electron.ipcRenderer.invoke("scrape-stream", title),
  closeApp: () => electron.ipcRenderer.send("close-app")
});
