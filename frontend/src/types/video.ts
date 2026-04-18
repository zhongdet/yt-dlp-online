export type VideoFormat = {
  format_id: string;
  ext: string;
  resolution: string | null;
  vcodec: string;
  acodec: string;
  format_note?: string;
  filesize?: number;
};

export type VideoInfo = {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  author?: string;
  format: VideoFormat[];
};

export type VideoItem = {
  uuid: string;
  url: string;
  status: "loading" | "success" | "error";
  info?: VideoInfo;
  errorMessage?: string;
  downloadTaskId?: string;
  downloadProgress?: string;
  downloadStatus?: "idle" | "downloading" | "finished" | "error";
  selectedFormatId?: string;
};

export type FormatOption = {
  id: string;
  label: string;
};
