import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { api } from "@/api/youtube";
import type { VideoItem } from "@/types/video";

interface UseDownload {
  setItemDownloadStatus: (
    uuid: string,
    status: VideoItem["downloadStatus"],
    progress?: string,
    errorMessage?: string,
  ) => void;
  addTaskId: (uuid: string) => void;
}

export function useDownload({ setItemDownloadStatus, addTaskId }: UseDownload) {
  const pollIntervalsRef = useRef<Map<string, number>>(new Map());

  const handleDownload = useCallback(
    async (uuid: string, url: string, selectedFormatId?: string, filename?: string) => {
      setItemDownloadStatus(uuid, "downloading", "0%");

      try {
        const res = await api.startDownload(uuid, url, selectedFormatId);

        if (!res.ok) throw new Error("Download failed to start");

        addTaskId(uuid);

        const pollProgress = setInterval(async () => {
          try {
            const pRes = await api.getProgress(uuid);
            if (pRes.ok) {
              const pData = await pRes.json();
              console.log(pData);

              if (pData.status === "finished") {
                clearInterval(pollProgress);
                pollIntervalsRef.current.delete(uuid);
                setItemDownloadStatus(uuid, "finished", "100%");
                window.open(api.getFileUrl(uuid, filename), "_blank");
              } else if (pData.status === "error") {
                clearInterval(pollProgress);
                pollIntervalsRef.current.delete(uuid);
                const errorMsg = pData.error || "Download failed";
                setItemDownloadStatus(uuid, "error", undefined, errorMsg);
                toast.error(errorMsg);
              } else if (pData.status === "downloading") {
                setItemDownloadStatus(uuid, "downloading", pData.progress);
              }
            }
          } catch {
            // ignore network errors while polling
          }
        }, 500);

        pollIntervalsRef.current.set(uuid, pollProgress);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Download failed";
        setItemDownloadStatus(uuid, "error", undefined, errorMsg);
        toast.error(errorMsg);
      }
    },
    [setItemDownloadStatus, addTaskId],
  );

  const cleanup = useCallback(() => {
    pollIntervalsRef.current.forEach((interval) => clearInterval(interval));
    pollIntervalsRef.current.clear();
  }, []);

  return { handleDownload, cleanup };
}
