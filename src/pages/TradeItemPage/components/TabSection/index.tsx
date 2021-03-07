import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { EAssetDetailTab } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginBottom: 8,
    "& > * + *": {
      marginLeft: 16,
    },
  },
  item: {
    fontSize: 16,
    color: transparentize(0.4, theme.colors.text.default),
    transition: "all 0.5s",
    textDecoration: "none",
    padding: "4px 0",
    borderBottom: `2px solid ${transparentize(0.4, theme.colors.transparent)}`,
    "&:hover": {
      opacity: 0.7,
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

export const TabSection = (props: IProps) => {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();

  const query = new URLSearchParams(location.search.toLowerCase());
  const tabName = query.get("tab");

  if (
    !Object.values(EAssetDetailTab)
      .map((e) => e.toLowerCase())
      .includes(tabName || "") &&
    !tabName &&
    !query
  ) {
    history.push(history.location.pathname);
  }

  return (
    <div className={clsx(classes.root, props.className)}>
      {Object.values(EAssetDetailTab).map((tab) => {
        const isActive = () => {
          if (tab.toLowerCase() === tabName) return true;
          if (tab === EAssetDetailTab.Info && !tabName) return true;
          return false;
        };
        return (
          <NavLink
            className={classes.item}
            isActive={isActive}
            key={tab}
            to={
              tab === EAssetDetailTab.Info
                ? history.location.pathname
                : `${history.location.pathname}?tab=${tab.toLowerCase()}`
            }
          >
            {tab}
          </NavLink>
        );
      })}
    </div>
  );
};
