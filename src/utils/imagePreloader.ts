export function preloadImages(imagePaths: string[]): Promise<void[]> {
  return Promise.all(
    imagePaths.map(path => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => reject(new Error(`Failed to load ${path}`))
        img.src = path
      })
    })
  )
}

export function preloadImagesInBackground(imagePaths: string[]): void {
  imagePaths.forEach(path => {
    const img = new Image()
    img.src = path
  })
}