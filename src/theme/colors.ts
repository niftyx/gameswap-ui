import { transparentize } from "polished";
import { THEME } from "utils/types.d";

const colors = [
  {
    name: THEME.Black,
    colors: {
      border: {
        primary: transparentize(0.92, "#FFF"),
        secondary: "#15161F",
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
        purple10: "#5F6BDD",
      },
      text: {
        default: "#FFF",
      },
    },
  },
  {
    name: THEME.White,
    colors: {
      border: {
        primary: transparentize(0.92, "#FFF"),
        secondary: "#15161F",
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
        purple10: "#5F6BDD",
      },
      text: {
        default: "#FFF",
      },
    },
  },
];

export default colors;
