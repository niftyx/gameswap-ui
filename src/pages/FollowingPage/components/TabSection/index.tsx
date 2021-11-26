import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React, { useEffect } from "react";
import { NavLink, matchPath, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  item: {
    fontSize: 14,
    textDecoration: "none",
    userSelect: "none",
    margin: "4px 20px",
    color: theme.colors.primary60,
    padding: "2px 0",
    cursor: "pointer",
    transition: "all 0.5s",
    borderBottom: `2px solid ${theme.colors.transparent}`,
    "&:hover": {
      color: transparentize(0.2, theme.colors.white),
      borderBottomColor: transparentize(0.2, theme.colors.lime),
    },
    "&.active": {
      color: theme.colors.white,
      borderBottomColor: theme.colors.lime,
    },
  },
}));

interface IProps {
  className?: string;
}

export const TabSection = (props: IProps) => {
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    const isIncludeAny = Tabs.map(
      (tab) =>
        !!matchPath(history.location.pathname, {
          exact: true,
          path: tab.href,
        })
    ).reduce((e1, e2) => e1 || e2);

    if (!isIncludeAny) {
      history.push(Tabs[0].href);
    }
  }, []);

  const Tabs = [
    {
      id: "games",
      title: "Games",
      href: "/following/games",
    },
    {
      id: "categories",
      title: "Categories",
      href: "/following/categories",
    },
    {
      id: "users",
      title: "Users",
      href: "/following/users",
    },
    {
      id: "collections",
      title: "Collections",
      href: "/following/collections",
    },
    {
      id: "items",
      title: "Items",
      href: "/following/items",
    },
  ];

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
