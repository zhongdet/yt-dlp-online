import { useCallback } from "react";
import { api } from "@/api/youtube";
import type { VideoInfo } from "@/types/video";

interface UseVideoFetch {
  setItemSuccess: (uuid: string, info: VideoInfo) => void;
  setItemError: (uuid: string, errorMessage: string) => void;
}

export function useVideoFetch({ setItemSuccess, setItemError }: UseVideoFetch) {
  const fetchVideoInfo = useCallback(
    async (uuid: string, url: string) => {
      try {
        const res = await api.getVideoInfo(url);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Failed to fetch video info");
        }

        setItemSuccess(uuid, data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setItemError(uuid, message);
      }
    },
    [setItemSuccess, setItemError]
  );

  return { fetchVideoInfo };
}
