import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 180,
    height: 180,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    border: `2px solid ${theme.colors.transparent}`,
    backgroundColor: theme.colors.primary90,
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.3s",
    "&.active": {
      borderColor: theme.colors.lime,
    },
    marginRight: 16,
    marginBottom: 16,
    overflow: "hidden",
    "&:last-child": {
      marginRight: 0,
    },
    position: "relative",
    "&::before": {
      position: "absolute",
      content: `""`,
      left: 0,
      right: 0,
      top: 0,
      height: "56%",
      filter: "blur(20px)",
      background:
        "linear-gradient(103.54deg, #09090B 22.29%, rgba(9, 9, 11, 0.5) 49.71%, #09090B 76.15%), url(.png)",
    },
  },
  title: {
    zIndex: 3,
    color: theme.colors.white,
    fontSize: theme.spacing(1.75),
    marginTop: 8,
  },
  subTitle: {
    zIndex: 3,
    color: transparentize(0.25, theme.colors.white),
    fontSize: theme.spacing(1.5),
  },
}));

interface IProps {
  title: string;
  subTitle: string;
  renderIcon: () => React.ReactNode;
  onClick: () => void;
  active: boolean;
}

export const FormCollectionChooseItem = (props: IProps) => {
  const classes = useStyles();
  const { active, onClick, renderIcon, subTitle, title } = props;

  return (
    <div
      className={clsx(classes.root, active ? "active" : "")}
      onClick={onClick}
    >
      {renderIcon()}
      <Typography align="center" className={classes.title}>
        {title}
      </Typography>
      <Typography align="center" className={classes.subTitle}>
        {subTitle}
      </Typography>
    </div>
  );
};
