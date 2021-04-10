import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import useCommonStyles from "styles/common";
import { EAssetDetailTab } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    overflowX: "auto",
    marginBottom: 12,
    paddingBottom: 4,
    "& > * + *": {
      marginLeft: 32,
    },
  },
  item: {
    fontSize: 16,
    fontWeight: 700,
    textTransform: "uppercase",
    color: transparentize(0.4, theme.colors.text.default),
    transition: "all 0.5s",
    textDecoration: "none",
    paddingBottom: 15,
    position: "relative",
    whiteSpace: "nowrap",
    "&::before": {
      content: `" "`,
      position: "absolute",
      left: "50%",
      bottom: 0,
      height: 3,
      right: "50%",
      borderRadius: 17,
      backgroundColor: theme.colors.transparent,
      transition: "all 0.5s",
    },
    "&:hover": {
      color: theme.colors.text.default,
      "&::before": {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background.fourth,
      },
    },
    "&.active": {
      color: theme.colors.text.default,
      "&::before": {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background.fourth,
      },
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
  const commonClasses = useCommonStyles();

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
    <div
      className={clsx(
        classes.root,
        commonClasses.scrollHorizontal,
        props.className
      )}
    >
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
