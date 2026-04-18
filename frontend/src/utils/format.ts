import type { VideoFormat, FormatOption } from "@/types/video";

export function parseFormatOptions(formats: VideoFormat[]): FormatOption[] {
  return formats
    .filter(
      (f) =>
        (f.vcodec !== "none" && f.resolution) ||
        (f.vcodec === "none" && f.acodec !== "none")
    )
    .map((f) => {
      if (f.vcodec === "none") {
        return {
          id: f.format_id,
          label: `Audio Only - ${f.ext} ${f.format_note || ""}`.trim(),
        };
      }
      return {
        id: f.format_id,
        label: `Video - ${f.resolution} (${f.ext})`,
      };
    });
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}
