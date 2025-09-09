"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useDebounce from "@/src/utils/useDebounce";
import { useGenerateImage } from "@/src/useGetImage";

const DEFAULT_INPUT =
  "super fast pink and gold jet is flying against a beautiful nebula, trail behind it";

export default function Home() {
  const [text, setText] = useState<string>(DEFAULT_INPUT);

  const debouncedText = useDebounce(text, 200);

  const params = useMemo(() => ({ prompt: debouncedText }), [debouncedText]);
  const { imageUrl, loading: imageLoading } = useGenerateImage(params);

  // Focus the input element when the page loads)
  const inputElement = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  const loading = imageLoading || debouncedText !== text;

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      <header className="bg-stone-800 p-4 top-0 z-10 shadow-md flex justify-between items-center gap-5">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type to generate images..."
          className="flex-grow p-2 bg-transparent text-stone-100 placeholder-stone-400 overflow-hidden text-xl resize-none h-10 outline-none mr-4"
          ref={inputElement}
          onFocus={(e) => e.target.setSelectionRange(0, e.target.value.length)}
        />
        <div className={"w-10 z-30 " + (loading ? "" : "hidden")}>
          <svg
            className="animate-spin"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                fill="white"
                d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"
              />
            </g>
          </svg>
        </div>

        <Link
          href="https://github.com/replicate/fast-flux-demo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            height="32"
            aria-hidden="true"
            viewBox="0 0 16 16"
            version="1.1"
            width="32"
            data-view-component="true"
            className="fill-white"
          >
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
        </Link>
      </header>
      <main>
        <Image
          src={imageUrl || "/placeholder.png"}
          alt={debouncedText}
          width={512}
          height={512}
          unoptimized
        />
      </main>
    </div>
  );
}
