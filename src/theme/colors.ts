import { transparentize } from "polished";
import { THEME } from "utils/types.d";

const colors = [
  {
    name: THEME.Black,
    colors: {
      transparent: "#0000",
      border: {
        primary: transparentize(0.92, "#FFF"),
        secondary: "#15161F",
        third: "#5F6171",
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
      },
      text: {
        default: "#FFF",
        secondary: "#3D425A",
        third: "#9C9EAC",
        fourth: "#393C50",
        sixth: "#4A506F",
        percentPositive: "#02D290",
        percentNegative: "#f28230",
        arrowUp: "#09B783",
        arrowDown: "#B94733",
      },
      activity: {
        bg: {
          buy: "#44D7B6",
          bid: "#5F6BDD",
          sale: "#FF005E",
        },
        text: {
          buy: "#000000",
          bid: "#FFFFFF",
          sale: "#FFFFFF",
        },
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
      },
      text: {
        default: "#FFF",
        secondary: "#3D425A",
        third: "#9C9EAC",
        fourth: "#393C50",
        sixth: "#4A506F",
        percentPositive: "#02D290",
        percentNegative: "#f28230",
        arrowUp: "#09B783",
        arrowDown: "#B94733",
      },
      activity: {
        bg: {
          buy: "#44D7B6",
          bid: "#5F6BDD",
          sale: "#FF005E",
        },
        text: {
          buy: "#000000",
          bid: "#FFFFFF",
          sale: "#FFFFFF",
        },
      },
    },
  },
];

export default colors;
