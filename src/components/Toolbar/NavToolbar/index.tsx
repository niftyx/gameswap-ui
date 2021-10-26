import { makeStyles } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import { NavLink } from "react-router-dom";
import { INavToolbarItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(1),
    },
  },
  item: {
    cursor: "pointer",
    fontSize: 14,
    color: transparentize(0.6, theme.colors.white),
    textDecoration: "none",
    "&.active": {
      color: theme.colors.white,
    },
  },
  icon: { fontSize: 20, color: transparentize(0.6, theme.colors.white) },
}));

interface IProps {
  className?: string;
  items: INavToolbarItem[];
}

export const NavToolbar = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      {props.items.map((item: INavToolbarItem, index: number) => {
        const { href, onClick, title } = item;
        const res = [];
        if (href) {
          res.push(
            <NavLink
              activeClassName="active"
              className={classes.item}
              isActive={() => (index === props.items.length - 1) as any}
              key={title}
              to={href}
            >
              {title}
            </NavLink>
          );
        } else {
          res.push(
            <span
              className={clsx(
                classes.item,
                index === props.items.length - 1 ? "active" : ""
              )}
              key={title}
              onClick={onClick}
            >
              {title}
            </span>
          );
        }
        if (index < props.items.length - 1) {
          res.push(<ChevronRightIcon className={classes.icon} key={index} />);
        }
        return res;
      })}
    </div>
  );
};
