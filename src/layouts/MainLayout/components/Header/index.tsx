import {
  AppBar,
  AppBarProps,
  Box,
  Divider,
  Hidden,
  Link,
  Toolbar,
  makeStyles,
} from "@material-ui/core";
import { ReactComponent as LogoSvg } from "assets/svgs/logo.svg";
import clsx from "clsx";
import { BackNextGroup } from "components";
import React from "react";
import { NavLink, useHistory } from "react-router-dom";

import AccountInfoBar from "../AccountInfoBar";
import LaunchPad from "../LaunchPad";
import Notifications from "../Notifications";
import SearchBar from "../SearchBar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    borderBottomColor: theme.colors.border.secondary,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
  },
  toolbar: {
    height: theme.custom.appHeaderHeight,
  },
  logoWrapper: {
    display: "flex",
    marginRight: theme.spacing(5.5),
  },
  logo: {
    height: theme.spacing(4),
  },
  toolbarRight: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    paddingRight: theme.spacing(1.75),
    paddingLeft: theme.spacing(5),
  },
  searchBar: {
    marginLeft: theme.spacing(5),
    [theme.breakpoints.down(1620)]: {
      display: "none",
    },
  },
  link: {
    color: theme.colors.link.default,
    fontSize: theme.custom.header.navItem.fontSize,
    lineHeight: theme.custom.header.navItem.lineHeight,
    fontWeight: theme.custom.header.navItem.fontWeight,
    transition: "all 0.5s",
    "& + &": {
      marginLeft: theme.spacing(2),
    },
    "&.active": {
      color: theme.colors.background.fourth,
    },
  },
  divider: {
    width: 1,
    height: Number(theme.custom.appHeaderHeight) - 2,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  notiLaunchWrapper: {
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(2),
  },
  notifications: {
    marginRight: theme.spacing(1),
  },
  launchPad: { marginRight: theme.spacing(1) },
  menuItems: {
    margin: `0 ${theme.spacing(2)}px`,
  },
  menuItemsContent: {
    maxWidth: 400,
    margin: "auto",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
}));

const Header = ({ className, ...rest }: AppBarProps) => {
  const classes = useStyles();
  const history = useHistory();
  const onNext = () => {
    history.go(1);
  };
  const onBack = () => {
    history.go(-1);
  };

  return (
    <AppBar className={clsx(classes.root, className)} color="default" {...rest}>
      <Toolbar className={classes.toolbar}>
        <NavLink className={classes.logoWrapper} to="/">
          <LogoSvg className={classes.logo} />
        </NavLink>
        <div className={classes.toolbarRight}>
          <Hidden mdDown>
            <BackNextGroup onBack={onBack} onNext={onNext} />
          </Hidden>

          <SearchBar className={classes.searchBar} />

          <Box className={classes.menuItems} flexGrow={1}>
            <div className={classes.menuItemsContent}>
              <Link
                className={classes.link}
                color="textSecondary"
                component={NavLink}
                to="/trade"
                underline="none"
                variant="body2"
              >
                TRADE
              </Link>
              <Link
                className={classes.link}
                color="textSecondary"
                component={NavLink}
                to="/browse"
                underline="none"
                variant="body2"
              >
                BROWSE
              </Link>
              <Link
                className={classes.link}
                color="textSecondary"
                component={NavLink}
                to="/faq"
                underline="none"
                variant="body2"
              >
                HOW IT WORKS
              </Link>
            </div>
          </Box>
          <Hidden mdDown>
            <div className={classes.notiLaunchWrapper}>
              <Notifications className={classes.notifications} />
              <LaunchPad className={classes.launchPad} />
            </div>
          </Hidden>

          <AccountInfoBar />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
