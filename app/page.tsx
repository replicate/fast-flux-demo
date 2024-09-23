"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

const MAX_STORED_IMAGES = 5

export default function Home() {
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [storedImages, setStoredImages] = useState<string[]>([])

  useEffect(() => {
    // Load stored images from localStorage on component mount
    const savedImages = localStorage.getItem('generatedImages')
    if (savedImages) {
      setStoredImages(JSON.parse(savedImages))
    }
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (text) {
        fetch(`/api/generate-image?text=${encodeURIComponent(text)}`)
          .then(res => res.json())
          .then(data => {
            setImageUrl(data.imageUrl)
            updateStoredImages(data.imageUrl)
          })
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [text])

  const updateStoredImages = (newImageUrl: string) => {
    const updatedImages = [newImageUrl, ...storedImages.slice(0, MAX_STORED_IMAGES - 1)]
    setStoredImages(updatedImages)
    localStorage.setItem('generatedImages', JSON.stringify(updatedImages))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="space-y-4 text-center">
        <div className="relative w-[512px] h-[512px] mb-16">
          {storedImages.map((url, index) => (
            <div
              key={url}
              className="absolute w-[512px] h-[512px] border border-gray-300 rounded-lg transition-all duration-300 ease-in-out"
              style={{
                left: `${index * -20}px`,
                zIndex: storedImages.length - index,
                opacity: 1 - index * 0.2,
              }}
            >
              <Image
                src={url}
                alt={`Generated image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover rounded-lg"
              />
            </div>
          ))}
          {storedImages.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 border border-gray-300 rounded-lg">
              Images will appear here
            </div>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to generate an image..."
          className="w-[512px] h-[100px] p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}