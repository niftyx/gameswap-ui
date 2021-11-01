import { Typography, makeStyles } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import clsx from "clsx";
import React from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    color: theme.colors.primary40,
    fontWeight: 200,
    fontSize: 13,
  },
  item: {
    display: "flex",
    alignItems: "center",
    "& p": { margin: 0 },
    "& svg": {
      color: theme.colors.primary80,
      margin: "0 16px",
    },
    "&:last-child": {
      "& p": {
        color: theme.colors.primary60,
      },
      "& svg": {
        display: "none",
      },
    },
  },
}));

interface IProps {
  className?: string;
}

const paths = [
  "All games",
  "Action",
  "Cyber Assault",
  "Glock KN-30 - Bubble Gum Edition",
];

export const HistoryNavBar = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      {paths.map((path) => {
        return (
          <div className={classes.item} key={path}>
            <p>{path}</p>
            <ChevronRightIcon />
          </div>
        );
      })}
    </div>
  );
};
