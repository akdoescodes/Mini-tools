import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function make(d: string, name: string) {
  const Icon = ({ size = 24, ...props }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={d} />
    </svg>
  );
  Icon.displayName = name;
  return Icon;
}

/* Material Symbols (filled) */
export const MenuIcon = make("M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z", "MenuIcon");
export const CloseIcon = make(
  "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  "CloseIcon",
);
export const HomeIcon = make("M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", "HomeIcon");
export const BoltIcon = make("M7 2v11h3v9l7-12h-4l4-8z", "BoltIcon");
export const PlayIcon = make("M8 5v14l11-7z", "PlayIcon");
export const PauseIcon = make("M6 19h4V5H6v14zm8-14v14h4V5h-4z", "PauseIcon");
export const ReplayIcon = make(
  "M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z",
  "ReplayIcon",
);
export const DownloadIcon = make("M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z", "DownloadIcon");
export const DeleteIcon = make(
  "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  "DeleteIcon",
);
export const ChevronLeftIcon = make("M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z", "ChevronLeftIcon");
export const ChevronRightIcon = make("M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z", "ChevronRightIcon");
export const AddIcon = make("M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z", "AddIcon");
export const UploadIcon = make("M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z", "UploadIcon");
export const ImageIcon = make(
  "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  "ImageIcon",
);
export const TimerIcon = make(
  "M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z",
  "TimerIcon",
);
export const LayersIcon = make(
  "M14 2H4c-1.1 0-2 .9-2 2v10h2V4h10V2zm4 4H8c-1.1 0-2 .9-2 2v10h2V8h10V6zm2 4h-8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2z",
  "LayersIcon",
);
export const NorthEastIcon = make("M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z", "NorthEastIcon");
export const CheckIcon = make("M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z", "CheckIcon");
export const DragIcon = make(
  "M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
  "DragIcon",
);
export const AspectIcon = make(
  "M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z",
  "AspectIcon",
);
export const MovieIcon = make(
  "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z",
  "MovieIcon",
);
export const LockIcon = make(
  "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
  "LockIcon",
);

/* Decorative glyphs for the hero cards */
export const SparkleGlyph = make(
  "M12 2c.5 5.2 2.3 7.4 10 10-7.7 2.6-9.5 4.8-10 10-.5-5.2-2.3-7.4-10-10 7.7-2.6 9.5-4.8 10-10z",
  "SparkleGlyph",
);
export const RingGlyph = make(
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z",
  "RingGlyph",
);
export const BurstGlyph = make(
  "M11 2h2l.4 6.3L17.7 4l1.4 1.4-4.3 4.3L21 11v2l-6.3.4 4.4 4.3-1.4 1.4-4.3-4.3L13 21h-2l-.4-6.3L6.3 19.1l-1.4-1.4 4.3-4.3L3 13v-2l6.3-.4L4.9 6.3l1.4-1.4 4.3 4.3z",
  "BurstGlyph",
);

/* More Material Symbols */
export const PaletteIcon = make(
  "M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
  "PaletteIcon",
);
export const InfoIcon = make(
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
  "InfoIcon",
);
export const WarningIcon = make("M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z", "WarningIcon");
export const CheckCircleIcon = make(
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  "CheckCircleIcon",
);
export const CopyIcon = make(
  "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z",
  "CopyIcon",
);
export const CodeIcon = make(
  "M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
  "CodeIcon",
);
export const ArrowUpIcon = make("M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z", "ArrowUpIcon");
export const GitHubIcon = make(
  "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z",
  "GitHubIcon",
);
