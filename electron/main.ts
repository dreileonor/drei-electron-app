import { app, BrowserWindow, screen, session } from 'electron'
import path from 'path'
import { setupIpcHandlers } from './ipc-handlers'

// Disable GPU compositing quirks for transparent windows on Windows
app.commandLine.appendSwitch('disable-gpu-sandbox')
app.commandLine.appendSwitch('enable-transparent-visuals')

let mainWindow: BrowserWindow | null = null

function createWindow() {
  const { bounds } = screen.getPrimaryDisplay()

  mainWindow = new BrowserWindow({
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
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  })

  mainWindow.setAlwaysOnTop(true, 'screen-saver')
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  mainWindow.setIgnoreMouseEvents(true, { forward: true })
  mainWindow.setMenuBarVisibility(false)

  // Prevent the window from losing always-on-top on blur (Windows)
  mainWindow.on('blur', () => {
    mainWindow?.setAlwaysOnTop(true, 'screen-saver')
  })

  // Load app
  if (process.env['VITE_DEV_SERVER_URL']) {
    mainWindow.loadURL(process.env['VITE_DEV_SERVER_URL'])
    // Uncomment to open DevTools during development:
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  setupIpcHandlers(mainWindow)
}

app.whenReady().then(() => {
  // Spoof headers for MAL CDN so hotlink protection doesn't block images
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['https://cdn.myanimelist.net/*'] },
    (details, callback) => {
      details.requestHeaders['Referer'] = 'https://myanimelist.net/'
      details.requestHeaders['User-Agent'] =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      callback({ requestHeaders: details.requestHeaders })
    }
  )

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
