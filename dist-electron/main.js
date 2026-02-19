"use strict";
const electron = require("electron");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const cheerio__namespace = /* @__PURE__ */ _interopNamespaceDefault(cheerio);
const HIANIME_BASE = "https://hianime.to";
async function scrapeHiAnime(title) {
  try {
    const encoded = encodeURIComponent(title);
    const { data } = await axios.get(`${HIANIME_BASE}/search?keyword=${encoded}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br"
      },
      timeout: 1e4
    });
    const $ = cheerio__namespace.load(data);
    const href = $(".flw-item .film-name a").first().attr("href");
    if (!href) return null;
    return `${HIANIME_BASE}${href}`;
  } catch (err) {
    console.error("[scrapeHiAnime] error:", err);
    return null;
  }
}
function setupIpcHandlers(mainWindow2) {
  electron.ipcMain.on("set-mouse-ignore", (_evt, ignore, options) => {
    if (mainWindow2.isDestroyed()) return;
    if (ignore) {
      mainWindow2.setIgnoreMouseEvents(true, options ?? { forward: true });
    } else {
      mainWindow2.setIgnoreMouseEvents(false);
    }
  });
  electron.ipcMain.on("open-external", (_evt, url) => {
    if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
      electron.shell.openExternal(url);
    }
  });
  electron.ipcMain.on("open-player", (_evt, url) => {
    if (!url || typeof url !== "string") return;
    const player = new electron.BrowserWindow({
      width: 1280,
      height: 720,
      title: "Watch",
      autoHideMenuBar: true,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js")
      }
    });
    player.loadURL(url);
    player.setMenuBarVisibility(false);
  });
  electron.ipcMain.handle("scrape-stream", async (_evt, title) => {
    if (typeof title !== "string" || !title.trim()) return null;
    return scrapeHiAnime(title.trim());
  });
  electron.ipcMain.on("close-app", () => {
    const { app } = require("electron");
    app.quit();
  });
}
electron.app.commandLine.appendSwitch("disable-gpu-sandbox");
electron.app.commandLine.appendSwitch("enable-transparent-visuals");
let mainWindow = null;
function createWindow() {
  const { bounds } = electron.screen.getPrimaryDisplay();
  mainWindow = new electron.BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    focusable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });
  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.on("blur", () => {
    mainWindow == null ? void 0 : mainWindow.setAlwaysOnTop(true, "screen-saver");
  });
  if (process.env["VITE_DEV_SERVER_URL"]) {
    mainWindow.loadURL(process.env["VITE_DEV_SERVER_URL"]);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  setupIpcHandlers(mainWindow);
}
electron.app.whenReady().then(() => {
  electron.session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ["https://cdn.myanimelist.net/*"] },
    (details, callback) => {
      details.requestHeaders["Referer"] = "https://myanimelist.net/";
      details.requestHeaders["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
      callback({ requestHeaders: details.requestHeaders });
    }
  );
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
