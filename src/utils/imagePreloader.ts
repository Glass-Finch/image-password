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
    try {
      // Validate inputs
      if (!Array.isArray(imagePaths)) {
        throw new Error('Invalid image paths - expected array')
      }

      // Filter out invalid paths
      const validPaths = imagePaths.filter(path => {
        if (!path || typeof path !== 'string') {
          console.warn('Skipping invalid image path:', path)
          return false
        }
        return true
      })

      if (validPaths.length === 0) {
        console.warn('No valid image paths found')
        resolve()
        return
      }

      let loadedCount = 0
      let errorCount = 0
      const total = validPaths.length
      
      const checkComplete = () => {
        if (loadedCount === total) {
          // Log summary of loading results
          if (errorCount > 0) {
            console.warn(`Image preloading completed with ${errorCount} failures out of ${total} images`)
          }
          resolve()
        }
      }
      
      validPaths.forEach((path, index) => {
        try {
          const img = new Image()
          
          img.onload = () => {
            loadedCount++
            onProgress?.(loadedCount, total)
            checkComplete()
          }
          
          img.onerror = () => {
            loadedCount++
            errorCount++
            console.warn(`Failed to load image (${index + 1}/${total}): ${path}`)
            onProgress?.(loadedCount, total)
            checkComplete()
          }
          
          // Add timeout to prevent hanging
          setTimeout(() => {
            if (img.complete === false) {
              loadedCount++
              errorCount++
              console.warn(`Image load timeout: ${path}`)
              onProgress?.(loadedCount, total)
              checkComplete()
            }
          }, 10000) // 10 second timeout per image
          
          img.src = path
        } catch (imageError) {
          loadedCount++
          errorCount++
          console.warn(`Error setting up image load for: ${path}`, imageError)
          onProgress?.(loadedCount, total)
          checkComplete()
        }
      })
    } catch (error) {
      console.error('Critical error in image preloader:', error)
      reject(error)
    }
  })
}

export function preloadImagesInBackground(imagePaths: string[]): void {
  imagePaths.forEach(path => {
    const img = new Image()
    img.src = path
  })
}