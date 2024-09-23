"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (text) {
        fetch(`/api/generate-image?text=${encodeURIComponent(text)}`)
          .then(res => res.json())
          .then(data => setImageUrl(data.imageUrl))
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [text])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="space-y-4 text-center">
        <div className="relative w-[300px] h-[300px] border border-gray-300 rounded-lg flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Generated image"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="text-gray-500">Image will appear here</div>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to generate an image..."
          className="w-[300px] h-[100px] p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}