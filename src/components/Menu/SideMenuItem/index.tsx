import { Hidden, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";
import { NavLink, matchPath, useHistory } from "react-router-dom";
import { ISideMenuItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(2)}px ${theme.spacing(0.5)}px`,
    padding: `${theme.spacing(0.125)}px ${theme.spacing(0.5)}px`,
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    "& > * + *": {
      marginLeft: theme.spacing(3),
    },
    color: transparentize(0.6, theme.colors.text.default),
    transition: "all 0.25s",
    "&:hover": {
      color: transparentize(0.25, theme.colors.text.default),
    },
    "&.active": {
      color: theme.colors.text.default,
    },
  },
  icon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  title: {
    fontSize: "14px",
    lineHeight: "19px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
}));

export const SideMenuItem = (props: ISideMenuItem) => {
  const { Icon, href, onClick, title } = props;
  const classes = useStyles();
  const history = useHistory();

  if (href) {
    const isActive = () =>
      !!matchPath(history.location.pathname, {
        path: href,
        exact: true,
      });
    return (
      <NavLink
        activeClassName="active"
        className={clsx(classes.root, props.className)}
        isActive={isActive}
        to={href}
      >
        <Icon className={classes.icon} />
        <Typography className={classes.title} component="div">
          {title}
        </Typography>
      </NavLink>
    );
  }
  return (
    <div className={clsx(classes.root, props.className)} onClick={onClick}>
      <Icon className={classes.icon} />
      <Typography className={classes.title} component="div">
        {title}
      </Typography>
    </div>
  );
};
