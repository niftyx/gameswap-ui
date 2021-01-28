import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 120,
    height: 120,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    border: `1px solid ${theme.colors.border.fourth}`,
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.3s",
    "&.active": {
      borderColor: theme.colors.text.default,
    },
    "& + &": {
      marginLeft: 16,
    },
    "&:hover": {
      opacity: 0.6,
    },
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.75),
    marginTop: 8,
  },
  subTitle: {
    color: transparentize(0.25, theme.colors.text.default),
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
