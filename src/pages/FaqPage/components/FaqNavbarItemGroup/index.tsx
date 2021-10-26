import { Typography, makeStyles } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import clsx from "clsx";
import { transparentize } from "polished";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useCommonStyles from "styles/common";
import { IFaqNavBarItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {},
  header: {
    userSelect: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${theme.spacing(1.5)}px 0`,
    "& > * + *": {
      marginLeft: theme.spacing(1.5),
    },
  },
  title: {
    color: theme.colors.white,
  },
  icon: {
    color: theme.colors.white,
    transition: "all 0.3s",
    transform: "rotate(180deg)",
    "&.expanded": {
      transform: "rotate(0deg)",
    },
  },
  navItem: {
    userSelect: "none",
    padding: theme.spacing(1.5),
    display: "block",
    textDecoration: "none",
    color: theme.colors.white,
    backgroundColor: theme.colors.transparent,
    transition: "all 0.3s",
    "&.active": {
      color: theme.colors.white,
      backgroundColor: transparentize(0.8, theme.colors.white),
    },
  },
  overEffect: {
    paddingLeft: theme.spacing(3),
    "&:hover": {
      color: theme.colors.white,
      backgroundColor: transparentize(0.6, theme.colors.white),
    },
  },
}));

interface IProps {
  className?: string;
  data: IFaqNavBarItem;
}

export const FaqNavbarItemGroup = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const {
    data: { children, title },
  } = props;
  const [expanded, setExpanded] = useState<boolean>(false);

  const renderItem = (item: IFaqNavBarItem, className?: string) => {
    return (
      <NavLink
        className={clsx(classes.navItem, className)}
        key={item.id}
        to={item.href}
      >
        <Typography component="div">{item.title}</Typography>
      </NavLink>
    );
  };

  if (children) {
    return (
      <div className={clsx(classes.root, props.className)}>
        <div className={classes.header} onClick={() => setExpanded(!expanded)}>
          <Typography className={classes.title} component="div">
            {title}
          </Typography>
          <ExpandLessIcon
            className={clsx(classes.icon, expanded ? "expanded" : "")}
          />
        </div>

        <div
          className={clsx(
            classes.content,
            commonClasses.maxHeightTransition,
            expanded ? "visible" : ""
          )}
        >
          {children.map((item) => renderItem(item, classes.overEffect))}
        </div>
      </div>
    );
  }
  return (
    <div className={clsx(classes.root, props.className)}>
      {renderItem(props.data)}
    </div>
  );
};
