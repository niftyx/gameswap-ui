import { colors, createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import { THEME } from "utils/enums";
import { ISettings } from "utils/types.d";

import CustomColors from "./colors";
import custom from "./custom";
import { softShadows, strongShadows } from "./shadows";
import typography from "./typography";

const baseOptions = {
  typography,
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: 3,
        overflow: "hidden",
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: "rgba(0,0,0,0.075)",
      },
    },
  },
};

const themesOptions = [
  {
    name: THEME.Black,
    overrides: {
      MuiInputBase: {
        input: {
          "&::placeholder": {
            opacity: 1,
            color: colors.blueGrey[600],
          },
        },
      },
      MuiInput: {
        underline: {
          "&::before": {
            borderBottomColor: "#4F5562",
          },
        },
      },
      MuiButton: {
        root: {
          padding: "14px 16px",
          borderRadius: "6px",
          textTransform: "none",
          fontWeight: 400,
        },
        label: {
          color: "#FFF",
        },
      },
    },
    palette: {
      type: "dark",
      action: {
        active: "rgba(255, 255, 255, 0.54)",
        hover: "rgba(255, 255, 255, 0.04)",
        selected: "rgba(255, 255, 255, 0.08)",
        disabled: "rgba(255, 255, 255, 0.26)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
        focus: "rgba(255, 255, 255, 0.12)",
      },
      background: {
        default: "#030616",
        dark: "#1c2025",
        paper: "#282C34",
      },
      primary: {
        main: "#5F6BDD",
      },
      secondary: {
        main: "#8a85ff",
      },
      text: {
        primary: "#e6e5e8",
        secondary: "#adb0bb",
      },
    },
    typography: {
      fontFamily: "'CircularStd',sans-serif",
    },
    shadows: strongShadows,
  },
  {
    name: THEME.White,
    overrides: {
      MuiInputBase: {
        input: {
          "&::placeholder": {
            opacity: 1,
            color: colors.blueGrey[600],
          },
        },
      },
      MuiInput: {
        underline: {
          "&::before": {
            borderBottomColor: "#4F5562",
          },
        },
      },
      MuiButton: {
        root: {
          padding: "14px 16px",
          borderRadius: "6px",
          textTransform: "none",
          fontWeight: 400,
        },
        label: {
          color: "#FFF",
        },
      },
    },
    palette: {
      type: "light",
      action: {
        active: "rgba(255, 255, 255, 0.54)",
        hover: "rgba(255, 255, 255, 0.04)",
        selected: "rgba(255, 255, 255, 0.08)",
        disabled: "rgba(255, 255, 255, 0.26)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
        focus: "rgba(255, 255, 255, 0.12)",
      },
      background: {
        default: "#030616",
        dark: "#1c2025",
        paper: "#282C34",
      },
      primary: {
        main: "#5F6BDD",
      },
      secondary: {
        main: "#8a85ff",
      },
      text: {
        primary: "#e6e5e8",
        secondary: "#adb0bb",
      },
    },
    typography: {
      fontFamily: "'CircularStd',sans-serif",
    },
    shadows: softShadows,
  },
];

export const createTheme = (config: ISettings) => {
  let themeOptions = themesOptions.find((theme) => theme.name === config.theme);
  let customColor = CustomColors.find(
    (element) => element.name === config.theme
  );

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    [themeOptions] = themesOptions;
  }
  if (!customColor) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    [customColor] = CustomColors;
  }

  let theme = createMuiTheme(
    Object.assign({}, baseOptions, themeOptions, { custom }, customColor) as any
  );

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
