import { Grid, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { transparentize } from "polished";
import React, { useState } from "react";
import { EProfileTab } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  item: {
    userSelect: "none",
    margin: "4px 12px",
    color: transparentize(0.4, theme.colors.text.default),
    padding: "4px 0",
    cursor: "pointer",
    transition: "all 0.5s",
    borderBottom: `3px solid ${transparentize(0.4, theme.colors.text.default)}`,
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
  tab: EProfileTab;
  onChange: (tab: EProfileTab) => void;
}

export const AssetsTabSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      {Object.keys(EProfileTab).map((tab) => (
        <div
          className={clsx(classes.item, tab === props.tab ? "active" : "")}
          key={tab}
          onClick={() => {
            props.onChange(tab as EProfileTab);
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};
