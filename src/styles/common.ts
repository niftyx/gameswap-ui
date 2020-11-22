import { makeStyles } from "@material-ui/core";
import { transparentize } from "polished";

const useCommonStyles = makeStyles((theme) => ({
  scroll: {
    "&::-webkit-scrollbar": {
      width: theme.spacing(0.5),
      boxShadow: `inset 0 0 6px ${transparentize(
        0.3,
        theme.colors.background.fourth
      )}`,
    },
    "&::-webkit-scrollbar-track": {},
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.colors.background.fourth,
    },
  },
  transparentButton: {
    backgroundColor: transparentize(0.9, theme.colors.text.default),
    borderRadius: theme.spacing(0.75),
    color: theme.colors.text.default,
    "&:hover": {
      backgroundColor: transparentize(0.5, theme.colors.text.default),
    },
  },
  textAlignRight: {
    textAlign: "right",
  },
}));

export default useCommonStyles;
