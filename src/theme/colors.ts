import { transparentize } from "polished";
import { THEME } from "utils/enums";

const colors = [
  {
    name: THEME.Black,
    colors: {
      transparent: "#0000",
      primary100: "#09090B",
      primary90: "#131216",
      primary80: "#323136",
      primary70: "#4D4D59",
      primary60: "#737278",
      primary40: "#A6A4AE",
      white: "#FFFFFF",
      purple60: "#5A40DB",
      purple40: "#7378D8",
      green: "#00E785",
      lime: "#A1F930",
      blue: "#447AF5",
      red60: "#FF4A47",
      red40: "#FF918F",
      lightBg:
        "radial-gradient(65.94% 100% at 53.33% 100%, rgba(242, 242, 242, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)",
      redBlue:
        "radial-gradient(90.23% 137.16% at 92.97% 86.25%, #FF00F5 0%, #00D1FF 100%)",
      greenBlue:
        "radial-gradient(100% 154.04% at 0% 0%, #00F48D 0%, #447AF5 100%)",
    },
  },
  {
    name: THEME.White,
    colors: {
      transparent: "#0000",
      primary100: "#01D27A",
      primary90: "#7DDA06",
      primary80: "#939393",
      primary70: "#BEBEBE",
      primary60: "#D6D6D6",
      primary40: "#E3E3E3",
      white: "#FFFFFF",
      purple60: "#5A40DB",
      purple40: "#7378D8",
      green: "#00E785",
      lime: "#A1F930",
      blue: "#447AF5",
      red60: "#FF4A47",
      red40: "#FF918F",
      lightBg:
        "radial-gradient(65.94% 100% at 53.33% 100%, rgba(242, 242, 242, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)",
      redBlue:
        "radial-gradient(90.23% 137.16% at 92.97% 86.25%, #FF00F5 0%, #00D1FF 100%)",
      greenBlue:
        "radial-gradient(100% 154.04% at 0% 0%, #00F48D 0%, #447AF5 100%)",
    },
  },
];

export default colors;
