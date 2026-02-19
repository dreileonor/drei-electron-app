import { ipcMain, shell, BrowserWindow } from 'electron'
import axios from 'axios'
import * as cheerio from 'cheerio'
import path from 'path'

const HIANIME_BASE = 'https://hianime.to'

async function scrapeHiAnime(title: string): Promise<string | null> {
  try {
    const encoded = encodeURIComponent(title)
    const { data } = await axios.get(`${HIANIME_BASE}/search?keyword=${encoded}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      timeout: 10000,
    })

    const $ = cheerio.load(data)
    const href = $('.flw-item .film-name a').first().attr('href')
    if (!href) return null
    return `${HIANIME_BASE}${href}`
  } catch (err) {
    console.error('[scrapeHiAnime] error:', err)
    return null
  }
}

export function setupIpcHandlers(mainWindow: BrowserWindow) {
  // Mouse transparency toggle
  ipcMain.on('set-mouse-ignore', (_evt, ignore: boolean, options?: { forward: boolean }) => {
    if (mainWindow.isDestroyed()) return
    if (ignore) {
      mainWindow.setIgnoreMouseEvents(true, options ?? { forward: true })
    } else {
      mainWindow.setIgnoreMouseEvents(false)
    }
  })

  // Open URL in default browser
  ipcMain.on('open-external', (_evt, url: string) => {
    if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
      shell.openExternal(url)
    }
  })

  // Open video player window
  ipcMain.on('open-player', (_evt, url: string) => {
    if (!url || typeof url !== 'string') return

    const player = new BrowserWindow({
      width: 1280,
      height: 720,
      title: 'Watch',
      autoHideMenuBar: true,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    })

    player.loadURL(url)
    player.setMenuBarVisibility(false)
  })

  // Scrape HiAnime for stream URL
  ipcMain.handle('scrape-stream', async (_evt, title: string) => {
    if (typeof title !== 'string' || !title.trim()) return null
    return scrapeHiAnime(title.trim())
  })

  // Quit app
  ipcMain.on('close-app', () => {
    const { app } = require('electron')
    app.quit()
  })
}
