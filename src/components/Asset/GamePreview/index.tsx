import { Button, Hidden, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";
import useCommonStyles from "styles/common";
import { IGameItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  header: {},
}));

interface IProps {
  className?: string;
}

export const TrendingGames = (props: IProps & IGameItem) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { backgroundIcon, onClick, title } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <img alt="img" src={backgroundIcon} />
      <Typography component="div">{title}</Typography>
    </div>
  );
};
