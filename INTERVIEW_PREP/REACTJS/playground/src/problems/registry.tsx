import type { ComponentType } from "react";
import OtpInputDemo from "./otp-input-box";
import ProgressBarDemo from "./progress-bar";
import DebounceInputDemo from "./debounce-input";
import FileSystemDemo from "./file-system";
import FileSystemV2Demo from "./file-system-v2";

/**
 * The single source of truth for what shows up in the sidebar.
 * Adding a problem = add its demo component here. Nothing else to wire up.
 */
export type Problem = {
  slug: string; // matches the folder name and the note file
  title: string;
  Component: ComponentType;
};

export const problems: Problem[] = [
  { slug: "otp-input-box", title: "OTP Input Box", Component: OtpInputDemo },
  { slug: "progress-bar", title: "Progress Bar", Component: ProgressBarDemo },
  { slug: "debounce-input", title: "Debounced Input", Component: DebounceInputDemo },
  { slug: "file-system", title: "File System Data Layer", Component: FileSystemDemo },
  { slug: "file-system-v2", title: "File System v2 (60-min)", Component: FileSystemV2Demo },
];
