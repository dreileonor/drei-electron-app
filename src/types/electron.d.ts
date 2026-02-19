export {}

declare global {
  interface Window {
    api: {
      setMouseIgnore: (ignore: boolean, options?: { forward: boolean }) => void
      openExternal: (url: string) => void
      openPlayer: (url: string) => void
      scrapeStream: (title: string) => Promise<string | null>
      closeApp: () => void
    }
  }
}
