import { formatRgb, parse } from "culori";

export const formatColor = (color: string): string => {
  if (
    color.startsWith("#") ||
    color.startsWith("rgb") ||
    color.startsWith("hsl")
  ) {
    return color;
  }

  try {
    const parsedColor = parse(color);

    if (!parsedColor) {
      return color;
    }

    return formatRgb(parsedColor) ?? color;
  } catch (error) {
    console.warn("Failed to format color:", color, error);
    return color;
  }
};
