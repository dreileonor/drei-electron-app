import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  setMouseIgnore: (ignore: boolean, options?: { forward: boolean }) =>
    ipcRenderer.send('set-mouse-ignore', ignore, options),

  openExternal: (url: string) =>
    ipcRenderer.send('open-external', url),

  openPlayer: (url: string) =>
    ipcRenderer.send('open-player', url),

  scrapeStream: (title: string): Promise<string | null> =>
    ipcRenderer.invoke('scrape-stream', title),

  closeApp: () =>
    ipcRenderer.send('close-app'),
})
