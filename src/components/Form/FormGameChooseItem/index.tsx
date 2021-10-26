import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 120,
    height: 120,
    borderRadius: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    border: `2px solid ${theme.colors.white}`,
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.3s",
    "&.active": {
      borderColor: theme.colors.primary60,
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
      <Typography align="center" className={classes.title}>
        {title}
      </Typography>
      <Typography align="center" className={classes.subTitle}>
        {subTitle}
      </Typography>
    </div>
  );
};
