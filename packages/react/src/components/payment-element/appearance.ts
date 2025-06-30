import { Appearance } from "@stripe/stripe-js";

const colors = {
  success: "#4d90b2",
  warning: "#f4ac4f",
  error: "#ff876f",

  background: "#09090B",
  backgroundSecondary: "#18181B",
  foreground: "#fafafa",
  foregroundSecondary: "#a1a1aa",
  foregroundTertiary: "#a1a1aa",

  border: "#27272a",
};

export const appearance = {
  theme: "flat",
  variables: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Geist", "Gill Sans", sans-serif',

    borderRadius: "0.25rem",
    focusOutline: "none",
    focusBoxShadow: "none",

    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorDanger: colors.error,
    colorBackground: colors.background,
    colorPrimary: colors.foreground,
    colorText: colors.foreground,
    colorTextSecondary: colors.foregroundSecondary,
    colorTextPlaceholder: colors.foregroundTertiary,
    tabIconColor: colors.foreground,
    tabIconSelectedColor: colors.foreground,
  },
  rules: {
    ".Input": {
      padding: "12px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.background,
      fontSize: "14px",
      outline: "none",
    },
    ".Input:focus": {
      backgroundColor: colors.backgroundSecondary,
    },
    ".Input::placeholder": {
      fontSize: "14px",
      color: colors.foregroundTertiary,
    },
    ".Label": {
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: "500",
    },
    // ".Block": {
    //   backgroundColor: "#000000",
    //   boxShadow: "none",
    //   padding: "12px",
    // },
    ".Tab": {
      padding: "10px 12px 8px 12px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.background,
    },
    ".Tab:hover": {
      backgroundColor: colors.backgroundSecondary,
    },
    ".Tab--selected, .Tab--selected:focus, .Tab--selected:hover": {
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.backgroundSecondary,
      color: colors.foreground,
    },
  },
} satisfies Appearance;
