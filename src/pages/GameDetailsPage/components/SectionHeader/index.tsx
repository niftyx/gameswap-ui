import { Typography, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 16,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontWeight: 500,
    fontSize: 24,
    color: theme.colors.white,
    userSelect: "none",
  },
  link: {
    marginLeft: 16,
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    "& svg": {
      width: 20,
      height: 20,
    },
  },
}));

interface IProps {
  className?: string;
  title: string;
  href: string;
}

export const SectionHeader = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { href, title } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography className={classes.title}>{title}</Typography>
      <NavLink
        className={clsx(classes.link, commonClasses.transparentButton)}
        to={href}
      >
        <AddIcon />
      </NavLink>
    </div>
  );
};
