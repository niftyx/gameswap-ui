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
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import AccountInfoBar from "../AccountInfoBar";
import BackNextGroup from "../BackNextGroup";
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
  },
  link: {
    color: theme.colors.link.default,
    fontSize: theme.custom.header.navItem.fontSize,
    lineHeight: theme.custom.header.navItem.lineHeight,
    fontWeight: theme.custom.header.navItem.fontWeight,
    "& + &": {
      marginLeft: theme.spacing(2),
    },
  },
  divider: {
    width: 1,
    height: Number(theme.custom.appHeaderHeight) - 2,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  notifications: {
    marginRight: theme.spacing(2),
  },
  launchPad: { marginRight: theme.spacing(2) },
  menuItems: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    margin: `0 ${theme.spacing(2)}px`,
  },
}));

const Header = ({ className, ...rest }: AppBarProps) => {
  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} color="default" {...rest}>
      <Toolbar className={classes.toolbar}>
        <RouterLink className={classes.logoWrapper} to="/">
          <LogoSvg className={classes.logo} />
        </RouterLink>
        <div className={classes.toolbarRight}>
          <Hidden mdDown>
            <BackNextGroup />
          </Hidden>
          <Hidden mdDown>
            <SearchBar className={classes.searchBar} />
          </Hidden>
          <Box className={classes.menuItems} flexGrow={1}>
            <Link
              className={classes.link}
              color="textSecondary"
              component={RouterLink}
              to="/trade"
              underline="none"
              variant="body2"
            >
              TRADE
            </Link>
            <Link
              className={classes.link}
              color="textSecondary"
              component={RouterLink}
              to="/browse"
              underline="none"
              variant="body2"
            >
              BROWSE
            </Link>
            <Link
              className={classes.link}
              color="textSecondary"
              component={RouterLink}
              to="/apps"
              underline="none"
              variant="body2"
            >
              LAUNCHPAD
            </Link>
          </Box>
          <Hidden mdDown>
            <Notifications className={classes.notifications} />
            <LaunchPad className={classes.launchPad} />
          </Hidden>

          <Divider className={classes.divider} />
          <AccountInfoBar />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
