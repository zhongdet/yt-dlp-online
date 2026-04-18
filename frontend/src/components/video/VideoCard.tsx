import type { VideoItem } from "@/types/video";
import { VideoCardSkeleton } from "./VideoCardSkeleton";
import { VideoCardError } from "./VideoCardError";
import { VideoCardContent } from "./VideoCardContent";

interface VideoCardProps {
  item: VideoItem;
  onFormatChange: (uuid: string, formatId: string) => void;
  onDownload: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

export function VideoCard({
  item,
  onFormatChange,
  onDownload,
  onDelete,
}: VideoCardProps) {

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-2">
      {item.status === "loading" && <VideoCardSkeleton />}

      {item.status === "error" && (
        <VideoCardError
          url={item.url}
          errorMessage={item.errorMessage}
          onDelete={() => onDelete(item.uuid)}
        />
      )}

      {item.status === "success" && (
        <VideoCardContent
          item={item}
          onFormatChange={(formatId) => onFormatChange(item.uuid, formatId)}
          onDownload={() => onDownload(item.uuid)}
          onDelete={() => onDelete(item.uuid)}
        />
      )}
    </div>
  );
}
