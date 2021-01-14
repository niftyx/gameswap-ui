import { EFileType } from "./enums";

export const getFileType = (file: File): EFileType => {
  const type = file.type;
  if (type.toString().includes("audio/")) {
    return EFileType.Audio;
  }
  if (type.toString().includes("image/")) {
    return EFileType.Image;
  }
  if (type.toString().includes("video/")) {
    return EFileType.Video;
  }
  return EFileType.Unknown;
};

export const bytesToSize = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
