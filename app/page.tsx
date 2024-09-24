"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Prediction } from 'replicate'

export default function Home() {
  const [text, setText] = useState('')
  const [images, setImages] = useState<Prediction[]>([])
  const prevTextRef = useRef('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const storedImages = localStorage.getItem('generatedImages')
    if (storedImages) {
      setImages(JSON.parse(storedImages))
    }
  }, [])

  const generateImage = useCallback(async () => {
    if (text && text !== prevTextRef.current) {
      prevTextRef.current = text
      try {
        const response = await fetch(`/api/generate-image?text=${encodeURIComponent(text)}`)
        const data = await response.json()
        if (data.prediction.status === 'succeeded') {
          const updatedImages = [data.prediction, ...images]
          setImages(updatedImages)
          localStorage.setItem('generatedImages', JSON.stringify(updatedImages))
        }
      } catch (error) {
        console.error('Error generating image:', error)
      }
    }
  }, [text, images])

  useEffect(() => {
    const debounce = setTimeout(() => {
      generateImage()
    }, 300) // Debounce for 300ms

    return () => clearTimeout(debounce)
  }, [generateImage])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('generatedImages')
    setImages([])
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      <header className="bg-stone-800 p-4 sticky top-0 z-10 shadow-md">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Type to generate images..."
          className="w-full p-2 bg-transparent text-stone-100 placeholder-stone-400 overflow-hidden text-xl resize-none h-10 outline-none"
          rows={1}
          autoFocus
        />
      </header>
      <main className="flex-grow">
        <div className="masonry sm:masonry-sm md:masonry-md">
          {images.map((img, index) => (
            <div key={img.output[0]} className="masonry-item relative overflow-hidden">
              {img.status === "succeeded" && (
                <>
                  <Image
                    src={img.output[0]}
                    alt={`Generated image ${index + 1}`}
                    width={512}
                    height={512}
                    className="w-full h-auto object-cover"
                  />
                  {img.metrics && img.metrics.predict_time !== undefined && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute bottom-0 left-0 bg-stone-900 bg-opacity-70 text-stone-300 text-sm px-2 py-1">
                        {Math.round(img.metrics.predict_time * 1000)}ms
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </main>
      {images.length > 0 && (
        <footer className="p-20 flex justify-center">
          <button
            type="button"
            onClick={clearLocalStorage}
            className="bg-stone-600 hover:bg-stone-700 text-stone-100 font-bold py-2 px-4 rounded"
          >
            Start Over
          </button>
        </footer>
      )}
    </div>
  )
}