import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useConnectedWeb3Context } from "contexts";
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
    color: theme.colors.primary40,
    transition: "all 0.25s",
    "&:hover": {
      color: theme.colors.white,
    },
    "&.active": {
      color: theme.colors.white,
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

  const { account, setWalletConnectModalOpened } = useConnectedWeb3Context();
  const isLoggedIn = Boolean(account);

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
        onClick={() => {
          if (!isLoggedIn && props.auth) {
            setWalletConnectModalOpened(true);
          }
        }}
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
