import {
  Appearance as StripeAppearance,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { useEffect } from "react";
import { formatColor } from "./color-utils";

export type Themes = "dark" | "light";
export type Fonts = StripeElementsOptions["fonts"];
export type AppearanceConfig = {
  theme?: Themes;
  borderRadius?: number;
  font?: string;
  colors?: {
    background?: string;
    foreground?: string;
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    muted?: string;
    mutedForeground?: string;
    accent?: string;
    accentForeground?: string;
    destructive?: string;
    border?: string;
    ring?: string;
    input?: string;
    card?: string;
    cardForeground?: string;
    popover?: string;
    popoverForeground?: string;
  };
};

export default function Appearance({
  appearance,
  fonts,
}: {
  appearance?: AppearanceConfig;
  fonts?: Fonts;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const variables = getVariablesFromAppearanceConfig(appearance);

      if (variables) {
        Object.entries(variables).forEach(([key, value]) => {
          (document.body as HTMLElement).style.setProperty(key, value);
        });
      }

      // Load fonts if provided
      if (fonts) {
        fonts.forEach((font) => {
          try {
            if ("cssSrc" in font) {
              // Handle CSS font source
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = font.cssSrc;
              document.body.appendChild(link);
            } else if ("family" in font) {
              // Handle custom font source
              const style = document.createElement("style");
              style.textContent = `
                @font-face {
                  font-family: '${font.family}';
                  src: ${font.src};
                  font-weight: ${font.weight || "normal"};
                  font-style: ${font.style || "normal"};
                }
              `;
              document.body.appendChild(style);
            }
          } catch (error) {
            console.error("Error loading font:", error);
          }
        });
      }
    } catch (error) {
      console.error("Error applying appearance styles:", error);
    }
  }, [appearance, fonts]);

  return null;
}

const getVariablesFromAppearanceConfig = (appearance?: AppearanceConfig) => {
  const colors = getColorVariablesFromAppearanceConfig(appearance);
  const definedAppearance = {
    ...colors,
    "--font-sans":
      appearance?.font ??
      '-apple-system, BlinkMacSystemFont, "Helvetica", "Gill Sans", "Inter", sans-serif',
    "--radius": appearance?.borderRadius
      ? `${appearance.borderRadius}rem`
      : "0.625rem",
  };

  return definedAppearance;
};

const getColorVariablesFromAppearanceConfig = (
  appearance?: AppearanceConfig
) => {
  // Determine if we're using dark theme
  const isDark = appearance?.theme === "dark";

  // Define fallback colors based on theme
  const fallbackColors = {
    background: isDark ? "oklch(0.145 0 0)" : "oklch(1 0 0)",
    foreground: isDark ? "oklch(0.985 0 0)" : "oklch(0.145 0 0)",
    card: isDark ? "oklch(0.205 0 0)" : "oklch(1 0 0)",
    cardForeground: isDark ? "oklch(0.985 0 0)" : "oklch(0.145 0 0)",
    popover: isDark ? "oklch(0.205 0 0)" : "oklch(1 0 0)",
    popoverForeground: isDark ? "oklch(0.985 0 0)" : "oklch(0.145 0 0)",
    primary: isDark ? "oklch(0.922 0 0)" : "oklch(0.205 0 0)",
    primaryForeground: isDark ? "oklch(0.205 0 0)" : "oklch(0.985 0 0)",
    secondary: isDark ? "oklch(0.269 0 0)" : "oklch(0.97 0 0)",
    secondaryForeground: isDark ? "oklch(0.985 0 0)" : "oklch(0.205 0 0)",
    muted: isDark ? "oklch(0.269 0 0)" : "oklch(0.97 0 0)",
    mutedForeground: isDark ? "oklch(0.708 0 0)" : "oklch(0.556 0 0)",
    accent: isDark ? "oklch(0.269 0 0)" : "oklch(0.97 0 0)",
    accentForeground: isDark ? "oklch(0.985 0 0)" : "oklch(0.205 0 0)",
    destructive: isDark
      ? "oklch(0.704 0.191 22.216)"
      : "oklch(0.577 0.245 27.325)",
    destructiveForeground: isDark
      ? "oklch(0.637 0.237 25.331)"
      : "oklch(0.577 0.245 27.325)",
    border: isDark ? "oklch(1 0 0 / 10%)" : "oklch(0.922 0 0)",
    ring: isDark ? "oklch(0.556 0 0)" : "oklch(0.708 0 0)",
    input: isDark ? "oklch(1 0 0 / 15%)" : "oklch(0.922 0 0)",
  };

  const colors = {
    "--background": appearance?.colors?.background ?? fallbackColors.background,
    "--foreground": appearance?.colors?.foreground ?? fallbackColors.foreground,

    // Card
    "--card": appearance?.colors?.card ?? fallbackColors.card,
    "--card-foreground":
      appearance?.colors?.cardForeground ?? fallbackColors.cardForeground,

    // Popover
    "--popover": appearance?.colors?.popover ?? fallbackColors.popover,
    "--popover-foreground":
      appearance?.colors?.popoverForeground ?? fallbackColors.popoverForeground,

    // Primary
    "--primary": appearance?.colors?.primary ?? fallbackColors.primary,
    "--primary-foreground":
      appearance?.colors?.primaryForeground ?? fallbackColors.primaryForeground,

    // Secondary
    "--secondary": appearance?.colors?.secondary ?? fallbackColors.secondary,
    "--secondary-foreground":
      appearance?.colors?.secondaryForeground ??
      fallbackColors.secondaryForeground,

    // Muted
    "--muted": appearance?.colors?.muted ?? fallbackColors.muted,
    "--muted-foreground":
      appearance?.colors?.mutedForeground ?? fallbackColors.mutedForeground,

    // Accent
    "--accent": appearance?.colors?.accent ?? fallbackColors.accent,
    "--accent-foreground":
      appearance?.colors?.accentForeground ?? fallbackColors.accentForeground,

    // Destructive
    "--destructive":
      appearance?.colors?.destructive ?? fallbackColors.destructive,
    "--destructive-foreground": fallbackColors.destructiveForeground,

    // Border and Input
    "--border": appearance?.colors?.border ?? fallbackColors.border,
    "--input": appearance?.colors?.input ?? fallbackColors.input,
    "--ring": appearance?.colors?.ring ?? fallbackColors.ring,
  };

  return colors;
};

const getFontSize = () => {
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return "16px"; // Mobile — prevent zoom
  }
  return "14px"; // Desktop
};

export const convertCheckoutAppearanceToStripeAppearance = (
  appearance?: AppearanceConfig,
  fonts?: Fonts
): StripeAppearance => {
  const currentVariables = getVariablesFromAppearanceConfig(appearance);
  const newAppearance: StripeAppearance = {
    theme: "flat",
    rules: {
      ".Input": {
        padding: "12px",
        border: `1px solid ${formatColor(currentVariables["--border"])}`,
        backgroundColor: formatColor(currentVariables["--background"]),
        fontSize: getFontSize(),
        outline: "none",
      },
      ".Input:focus": {
        backgroundColor: formatColor(currentVariables["--secondary"]),
      },
      ".Input::placeholder": {
        fontSize: getFontSize(),
        color: formatColor(currentVariables["--muted-foreground"]),
      },
      ".Label": {
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
      // Removed cursor property as it's not supported by Stripe
      // ".Input:disabled, .Input--invalid:disabled": {
      //   cursor: "not-allowed",
      // },
      // ".Block": {
      //   backgroundColor: "#000000",
      //   boxShadow: "none",
      //   padding: "12px",
      // },
      ".Tab": {
        padding: "10px 12px 8px 12px",
        border: `1px solid ${formatColor(currentVariables["--border"])}`,
        backgroundColor: formatColor(currentVariables["--background"]),
      },
      ".Tab:hover": {
        backgroundColor: formatColor(currentVariables["--secondary"]),
      },
      ".Tab--selected, .Tab--selected:focus, .Tab--selected:hover": {
        border: `1px solid ${formatColor(currentVariables["--border"])}`,
        backgroundColor: formatColor(currentVariables["--secondary"]),
        color: formatColor(currentVariables["--foreground"]),
      },
    },
    variables: {
      focusOutline: "none",
      focusBoxShadow: "none",

      fontFamily: fonts
        ? currentVariables["--font-sans"]
        : '-apple-system, BlinkMacSystemFont, "Gill Sans", sans-serif',
      borderRadius: currentVariables["--radius"],
      // colorSuccess: currentVariables["--success"],
      // colorWarning: currentVariables["--warning"],
      colorDanger: formatColor(currentVariables["--destructive"]),
      colorBackground: formatColor(currentVariables["--background"]),
      colorPrimary: formatColor(currentVariables["--primary"]),
      colorText: formatColor(currentVariables["--foreground"]),
      colorTextSecondary: formatColor(
        currentVariables["--secondary-foreground"]
      ),
      colorTextPlaceholder: formatColor(currentVariables["--muted-foreground"]),
    },
  };

  return newAppearance;
};
