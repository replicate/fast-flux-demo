"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const [text, setText] = useState('')
  const [prediction, setPrediction] = useState('')

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (text) {
        fetch(`/api/generate-image?text=${encodeURIComponent(text)}`)
          .then(res => res.json())
          .then(data => setPrediction(data.prediction))
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [text])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[512px] space-y-4 text-center">
        <div className="relative w-full aspect-square border border-gray-300 rounded-lg flex items-center justify-center">
          {prediction?.status === "succeeded" ? (
            <Image
              src={prediction?.output[0]}
              alt="Generated image"
              fill
              sizes="(max-width: 768px) 100vw, 512px"
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
          className="w-full h-[100px] p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}