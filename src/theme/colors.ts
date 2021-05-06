import { transparentize } from "polished";
import { THEME } from "utils/enums";

const colors = [
  {
    name: THEME.Black,
    colors: {
      transparent: "#0000",
      border: {
        primary: transparentize(0.92, "#FFF"),
        secondary: "#15161F",
        third: "#5F6171",
        fourth: "#626B78",
        fifth: "#24283E",
        sixth: transparentize(0.75, "#FFF"),
      },
      icon: {
        active: "#FFF",
        disabled: "#353845",
      },
      link: {
        default: "#FFF",
      },
      background: {
        primary: "#292D4B",
        secondary: "#030616",
        third: "#383E6C",
        fourth: "#5F6BDD",
        fifth: "#14172F",
        sixth: "#0D1022",
        seventh: "#02D290",
        eighth: "#4C5395",
        ninth: "#21243F",
        tenth: "#5F6171",
        eleventh: "#151B2D",
        twelfth: "#1F263C",
        thirteenth: "#2660F7",
        preview: "#141A28",
        gradient1:
          "linear-gradient(160deg, rgba(58, 62, 69, 0) 11%, black 82%)",
        gradient2:
          "linear-gradient(333deg, rgba(58, 62, 69, 0.1) 36%, rgba(10, 10, 10, 0.6) 64%)",
        gradient3:
          "linear-gradient(175deg, rgba(58, 62, 69, 0) 28%, black 92%)",
        gradient4: "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)",
      },
      text: {
        default: "#FFF",
        secondary: "#3D425A",
        third: "#9C9EAC",
        fourth: "#393C50",
        sixth: "#4A506F",
        seventh: "#A6A9B7",
        positive: "#02D290",
        negative: "#f28230",
        arrowUp: "#09B783",
        arrowDown: "#B94733",
        error: "#f44336",
        heart: "#B4366E",
      },
      shadow: {
        modal: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  {
    name: THEME.White,
    colors: {
      transparent: "#0000",
      border: {
        primary: transparentize(0.92, "#FFF"),
        secondary: "#15161F",
        third: "#5F6171",
        fourth: "#626B78",
        fifth: "#24283E",
        sixth: transparentize(0.75, "#FFF"),
      },
      icon: {
        active: "#FFF",
        disabled: "#353845",
      },
      link: {
        default: "#FFF",
      },
      background: {
        primary: "#292D4B",
        secondary: "#030616",
        third: "#383E6C",
        fourth: "#5F6BDD",
        fifth: "#14172F",
        sixth: "#0D1022",
        seventh: "#02D290",
        eighth: "#4C5395",
        ninth: "#21243F",
        tenth: "#5F6171",
        eleventh: "#151B2D",
        twelfth: "#1F263C",
        thirteenth: "#2660F7",
        preview: "#141A28",
        gradient1:
          "linear-gradient(160deg, rgba(58, 62, 69, 0) 11%, black 82%)",
        gradient2:
          "linear-gradient(333deg, rgba(58, 62, 69, 0.1) 36%, rgba(10, 10, 10, 0.6) 64%)",
        gradient3:
          "linear-gradient(175deg, rgba(58, 62, 69, 0) 28%, black 92%)",
        gradient4: "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)",
      },
      text: {
        default: "#FFF",
        secondary: "#3D425A",
        third: "#9C9EAC",
        fourth: "#393C50",
        sixth: "#4A506F",
        seventh: "#A6A9B7",
        positive: "#02D290",
        negative: "#f28230",
        arrowUp: "#09B783",
        arrowDown: "#B94733",
        error: "#f44336",
        heart: "#B4366E",
      },
      shadow: {
        modal: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      },
    },
  },
];

export default colors;
