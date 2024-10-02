"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [texts, setTexts] = useState<string[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTexts([...texts, e.target.value]);
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      <header className="bg-stone-800 p-4 sticky top-0 z-10 shadow-md">
        <input
          type="text"
          value={texts[texts.length - 1]}
          onChange={onChange}
          placeholder="Type to generate images..."
          className="w-full p-2 bg-transparent text-stone-100 placeholder-stone-400 overflow-hidden text-xl resize-none h-10 outline-none"
          autoFocus
        />
      </header>
      <main>
        {texts.map((text, index) => (
          <Image
            key={index}
            src={`/api/generate-image?text=${encodeURIComponent(text)}`}
            alt={text}
            width={512}
            height={512}
            className="absolute top-0 left-0"
            unoptimized
          />
        ))}
      </main>
    </div>
  );
}
