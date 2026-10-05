declare module 'gifshot' {
  type CreateGifOptions = {
    images: string[]
    interval: number
    gifWidth: number
    gifHeight: number
    numWorkers?: number
    progressCallback?: (progress: number) => void
  }

  type CreateGifResult = {
    error?: string | boolean
    image?: string
  }

  const gifshot: {
    createGIF: (
      options: CreateGifOptions,
      callback: (result: CreateGifResult) => void,
    ) => void
  }

  export default gifshot
}
