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
    padding: theme.spacing(1.5),
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(1.125),
  },
  content: {
    position: "relative",
    paddingTop: "59%",
  },
  img: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: theme.spacing(1),
    backgroundSize: "cover",
  },
}));

interface IProps {
  className?: string;
  onClick?: () => void;
}

export const GamePreview = (props: IProps & IGameItem) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { backgroundImage, onClick, title } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <div
          className={classes.img}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      </div>
      <Typography className={classes.title} component="div">
        {title}
      </Typography>
    </div>
  );
};
