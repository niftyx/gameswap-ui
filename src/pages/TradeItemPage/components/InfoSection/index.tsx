import {
  Avatar,
  Button,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import clsx from "classnames";
import { ProfileMarker } from "components/Marker";
import { transparentize } from "polished";
import React from "react";
import { useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";
import { EProfileMarker } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
  },
  title: {
    left: theme.spacing(2),
    top: theme.spacing(4),
    color: theme.colors.text.default,
    fontSize: theme.spacing(3.75),
  },
  gameType: {
    fontSize: theme.spacing(2.5),
    color: theme.colors.text.sixth,
  },
}));

interface IProps {
  className?: string;
}

export const InfoSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();

  const onBrowse = () => {
    history.push("/browse");
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div>
        <Typography className={classes.title} component="div">
          Stealth Fighter KN-30
        </Typography>
        <Typography className={classes.gameType} component="div">
          Cyber Assault
        </Typography>
      </div>
    </div>
  );
};
