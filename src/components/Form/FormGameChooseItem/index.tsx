import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary90,
    width: 180,
    height: 160,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    border: `2px solid ${theme.colors.transparent}`,
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.3s",
    overflow: "hidden",
    "&.active": {
      borderColor: theme.colors.lime,
    },
    marginRight: 16,
    marginBottom: 16,
    "&:last-child": {
      marginRight: 0,
    },
    "&:hover": {
      opacity: 0.6,
    },
  },
  title: {
    color: theme.colors.white,
    fontSize: theme.spacing(1.75),
    marginTop: 8,
  },
  subTitle: {
    color: transparentize(0.25, theme.colors.white),
    fontSize: theme.spacing(1.5),
  },
  bottom: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
}));

interface IProps {
  title: string;
  subTitle: string;
  renderIcon: () => React.ReactNode;
  onClick: () => void;
  active: boolean;
}

export const FormGameChooseItem = (props: IProps) => {
  const classes = useStyles();
  const { active, onClick, renderIcon, subTitle, title } = props;

  return (
    <div
      className={clsx(classes.root, active ? "active" : "")}
      onClick={onClick}
    >
      {renderIcon()}
      <div className={classes.bottom}>
        <Typography align="center" className={classes.title}>
          {title}
        </Typography>
        <Typography align="center" className={classes.subTitle}>
          {subTitle}
        </Typography>
      </div>
    </div>
  );
};
