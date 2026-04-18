import { ScrollArea } from "@/components/ui/scroll-area";
import type { VideoItem } from "@/types/video";
import { VideoCard } from "./VideoCard";

interface VideoListProps {
  items: VideoItem[];
  onFormatChange: (uuid: string, formatId: string) => void;
  onDownload: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

export function VideoList({ items, onFormatChange, onDownload, onDelete }: VideoListProps) {
  if (items.length === 0) return null;

  return (
    <ScrollArea className="w-full max-h-[60vh] rounded-2xl">
      <div className="space-y-4 pr-4">
        {items.map((item) => (
          <VideoCard
            key={item.uuid}
            item={item}
            onFormatChange={onFormatChange}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
