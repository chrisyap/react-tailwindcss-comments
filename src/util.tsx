import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const toHex = (c: number): string => {
  return c.toString(16).padStart(2, "0");
};

export const getRandomNonPastelHex = (): string => {
  let r: number, g: number, b: number;

  const MAX_BRIGHTNESS_FOR_DEEP = 100; // If max component is below this, it's deep/dark.
  const MIN_SATURATION_DIFFERENCE = 80; // If max - min is above this, it's saturated.

  do {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);

    const max: number = Math.max(r, g, b);
    const min: number = Math.min(r, g, b);

    const isDeep: boolean = max < MAX_BRIGHTNESS_FOR_DEEP;

    const isSaturated: boolean = max - min > MIN_SATURATION_DIFFERENCE;

    if (isDeep || isSaturated) {
      break;
    }
  } while (true); // Loop until a non-pastel color is generated

  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
};
