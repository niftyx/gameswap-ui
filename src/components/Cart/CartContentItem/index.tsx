import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    minHeight: theme.spacing(40),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.5s",
    "&:hover": {},
  },
  content: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    width: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
  },
  img: {},
  titleWrapper: { flex: 1, "& > * + *": { marginTop: theme.spacing(1) } },
  title: {
    textAlign: "center",
    fontSize: theme.spacing(2.5),
    color: theme.colors.text.default,
  },
  comment: {
    textAlign: "center",
    fontSize: theme.spacing(2),
    color: transparentize(0.4, theme.colors.text.default),
  },
}));

interface IProps {
  className?: string;
  data: IAssetItem;
}

export const CartContentItem = (props: IProps) => {
  const classes = useStyles();
  const { data } = props;

  return <div className={clsx(classes.root, props.className)}></div>;
};
