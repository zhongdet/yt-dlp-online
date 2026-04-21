import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Download, Trash2, Loader2, AlertCircle, Check } from "lucide-react";
import { HoverIconButton } from "@/components/hoverIconBtn";
import type { VideoItem } from "@/types/video";
import { parseFormatOptions, formatDuration } from "@/utils/format";

interface VideoCardContentProps {
  item: VideoItem;
  onFormatChange: (formatId: string) => void;
  onDownload: () => void;
  onDelete: () => void;
}

export function VideoCardContent({
  item,
  onFormatChange,
  onDownload,
  onDelete,
}: VideoCardContentProps) {
  const { info, selectedFormatId, downloadStatus, downloadProgress, url } =
    item;
  if (!info) return null;

  const formatOptions = parseFormatOptions(info.format);

  return (
    <Card className="bg-neutral-900/70 border-1 border-neutral-800 hover:border-neutral-700 transition-all backdrop-blur-md overflow-hidden relative group/card p-2">
      <CardContent className="p-0 flex flex-col md:flex-row h-auto md:h-40">
        <div className="w-full md:w-56 h-48 md:h-full relative overflow-hidden bg-transparent flex-shrink-0 group rounded-l">
          <img
            src={info.thumbnail}
            alt="Thumbnail"
            className="w-full h-full hover:cursor-pointer object-cover opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105 duration-500 rounded"
            onClick={() => window.open(url, "_")}
          />
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-mono backdrop-blur-xl">
            {formatDuration(info.duration)}
          </div>
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-2 leading-tight pr-8">
              {info.title}
            </h3>
            <p className="text-neutral-400 text-sm flex items-center gap-2">
              {info.author || "Unknown Author"}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <Select
              value={selectedFormatId}
              onValueChange={(val) => val && onFormatChange(val)}
            >
              <SelectTrigger className="w-[200px] h-9 bg-neutral-950 border-neutral-800 text-xs">
                <span>
                  {formatOptions.find((opt) => opt.id === selectedFormatId)
                    ?.label || "Select quality..."}
                </span>{" "}
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
                {formatOptions.map((opt) => (
                  <SelectItem
                    key={opt.id}
                    value={opt.id}
                    className="text-xs focus:bg-neutral-800 focus:text-neutral-50 cursor-pointer"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-neutral-500 hover:text-zinc-400 bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-3 right-3  transition-opacity group/download">
          {downloadStatus === "downloading" || downloadStatus === "error" ? (
            <Button
              className={`h-8 px-3 text-xs font-semibold rounded-lg transition-all ${
                downloadStatus === "downloading"
                  ? "bg-neutral-800 text-neutral-300"
                  : "bg-red-900/50 text-red-500 hover:bg-red-900/70 border border-red-500/20"
              }`}
              disabled={!selectedFormatId || downloadStatus === "downloading"}
              onClick={onDownload}
            >
              {downloadStatus === "downloading" ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  {downloadProgress}
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Error
                </>
              )}
            </Button>
          ) : (
            <div className="group">
              <HoverIconButton
                hoverIcon={
                  downloadStatus === "finished" ? <Check /> : <Download />
                }
                onClick={onDownload}
                disabled={!selectedFormatId}
              >
                {" "}
                Download
              </HoverIconButton>
            </div>
          )}
        </div>

        {downloadStatus === "downloading" && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-zinc-100 shadow_0_0_30px_rgba(255, 255, 255, 0.3) transition-all duration-300 ease-out"
            style={{
              width:
                downloadProgress === "error"
                  ? "100%"
                  : `${parseFloat(downloadProgress || "0")}%`,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
