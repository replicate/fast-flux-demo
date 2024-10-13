import { useState, useEffect } from "react";

interface UseGenerateImageParams {
  prompt: string;
}

export const useGenerateImage = (params: UseGenerateImageParams) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.prompt) return;

    const fetchImage = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/generate-image?text=${encodeURIComponent(params.prompt)}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    // Clean up the URL object when the component unmounts or text changes
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [params]);

  return { imageUrl, loading, error };
};
