import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import { NavLink, matchPath, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  item: {
    textDecoration: "none",
    userSelect: "none",
    margin: "4px 12px",
    color: transparentize(0.4, theme.colors.text.default),
    padding: "2px 0",
    cursor: "pointer",
    transition: "all 0.5s",
    borderBottom: `3px solid ${theme.colors.transparent}`,
    "&:hover": {
      color: transparentize(0.2, theme.colors.text.default),
      borderBottomColor: transparentize(0.2, theme.colors.text.default),
    },
    "&.active": {
      color: theme.colors.text.default,
      borderBottomColor: theme.colors.text.default,
    },
  },
}));

interface IProps {
  className?: string;
}

export const AssetsTabSection = (props: IProps) => {
  const classes = useStyles();
  const history = useHistory();

  const Tabs = [
    { id: "assets", title: "Assets", href: "/profile/assets" },
    { id: "on-sale", title: "OnSale", href: "/profile/on-sale" },
    { id: "created", title: "Created", href: "/profile/created" },
    { id: "liked", title: "Liked", href: "/profile/liked" },
  ];

  const isIncludeAny = Tabs.map(
    (tab) =>
      !!matchPath(history.location.pathname, { exact: true, path: tab.href })
  ).reduce((e1, e2) => e1 || e2);

  if (!isIncludeAny) {
    history.push(Tabs[0].href);
  }

  return (
    <div className={clsx(classes.root, props.className)}>
      {Tabs.map((tab) => {
        const isActive = () =>
          !!matchPath(history.location.pathname, {
            exact: true,
            path: tab.href,
          });
        return (
          <NavLink
            className={classes.item}
            isActive={isActive}
            key={tab.id}
            to={tab.href}
          >
            {tab.title}
          </NavLink>
        );
      })}
    </div>
  );
};
