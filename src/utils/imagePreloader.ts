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

export function preloadImagesWithProgress(
  imagePaths: string[], 
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    let loadedCount = 0
    const total = imagePaths.length
    
    if (total === 0) {
      resolve()
      return
    }
    
    const checkComplete = () => {
      if (loadedCount === total) {
        resolve()
      }
    }
    
    imagePaths.forEach(path => {
      const img = new Image()
      img.onload = () => {
        loadedCount++
        onProgress?.(loadedCount, total)
        checkComplete()
      }
      img.onerror = () => {
        loadedCount++
        console.warn(`Failed to load image: ${path}`)
        onProgress?.(loadedCount, total)
        checkComplete()
      }
      img.src = path
    })
  })
}

export function preloadImagesInBackground(imagePaths: string[]): void {
  imagePaths.forEach(path => {
    const img = new Image()
    img.src = path
  })
}