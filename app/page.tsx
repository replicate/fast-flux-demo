"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState('/placeholder.svg?height=300&width=300')

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
        <div className="relative w-[300px] h-[300px]">
          <Image
            src={imageUrl}
            alt="Generated image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
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