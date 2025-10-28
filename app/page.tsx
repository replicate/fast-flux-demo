"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_INPUT = "super fast pink and gold jet is flying against a beautiful nebula, trail behind it"
const STORAGE_KEY = "replicate_api_token";

export default function Home() {
  const [texts, setTexts] = useState<string[]>([DEFAULT_INPUT]);
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    if (storedToken) {
      setApiToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTexts([...texts, e.target.value]);
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      localStorage.setItem(STORAGE_KEY, tokenInput.trim());
      setApiToken(tokenInput.trim());
      setTokenInput("");
    }
  };

  const handleClearToken = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiToken(null);
    setTexts([DEFAULT_INPUT]);
  };

  // Focus the input element when the page loads
  const inputElement = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputElement.current && apiToken) {
      inputElement.current.focus();
    }
  }, [apiToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-stone-400">Loading...</div>
      </div>
    );
  }

  if (!apiToken) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-800 rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-stone-100 mb-4">Welcome to Fast Flux Demo</h1>
          <p className="text-stone-300 mb-4">
            To use this app, you need a Replicate API token. Enter your token below to get started.
          </p>
          <p className="text-stone-400 text-sm mb-6">
            <Link
              href="https://github.com/replicate/fast-flux-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Learn more about this demo
            </Link>
          </p>

          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-stone-300 mb-2">
                Replicate API Token
              </label>
              <input
                id="token"
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="r8_..."
                className="w-full p-3 bg-stone-700 text-stone-100 placeholder-stone-400 rounded border border-stone-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!tokenInput.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-stone-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded transition-colors"
            >
              Let&apos;s make some images
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-700">
            <p className="text-sm text-stone-400 mb-2">Don&apos;t have a token?</p>
            <Link
              href="https://replicate.com/account/api-tokens?new-token-name=fast-flux-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Generate a new API token on Replicate
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      <header className="bg-stone-800 p-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <input
          type="text"
          value={texts[texts.length - 1]}
          onChange={onChange}
          placeholder="Type to generate images..."
          className="flex-grow p-2 bg-transparent text-stone-100 placeholder-stone-400 overflow-hidden text-xl resize-none h-10 outline-none mr-4"
          ref={inputElement}
          onFocus={(e) => e.target.setSelectionRange(0, e.target.value.length)}
        />
        <div className="flex items-center gap-4">
          <button
            onClick={handleClearToken}
            className="text-stone-400 hover:text-stone-200 text-sm"
            title="Clear API token"
          >
            Clear Token
          </button>
          <Link href="https://github.com/replicate/fast-flux-demo" target="_blank" rel="noopener noreferrer">
            <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" className="fill-white">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
          </Link>
        </div>
      </header>
      <main>
        {texts.map((text, index) => (
          <Image
            key={index}
            src={`/api/generate-image?text=${encodeURIComponent(text)}&token=${encodeURIComponent(apiToken)}`}
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
