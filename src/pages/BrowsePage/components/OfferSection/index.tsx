import { Typography, makeStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import { MoreDownArrow } from "components";
import React, { useState } from "react";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 16,
    border: `1px solid ${theme.colors.primary85}`,
    borderRadius: 4,
  },
  header: {
    display: "flex",
    alignItems: "center",

    cursor: "pointer",
    transition: "all 0.4s",
    "&:hover": { opacity: 0.7 },
  },
  headerIcon: { color: theme.colors.primary60 },
  headerTitle: {
    color: theme.colors.primary60,
    fontSize: 14,
    flex: 1,
    margin: "0 16px",
  },
  headerPrice: { color: theme.colors.primary70, fontSize: 14 },

  content: {},
  commentWrapper: {
    paddingTop: 80,
  },
  commentText: {
    fontSize: 13,
    color: theme.colors.primary70,
    "& span": {
      color: theme.colors.primary40,
    },
  },
}));

interface IProps {
  className?: string;
}

interface IState {
  expanded: boolean;
}

export const OfferSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const [state, setState] = useState<IState>({ expanded: false });

  const setExpanded = (expanded: boolean) =>
    setState((prev) => ({ ...prev, expanded }));

  return (
    <div className={clsx(classes.root, props.className)}>
      <div
        className={classes.header}
        onClick={() => setExpanded(!state.expanded)}
      >
        <ExpandMoreIcon className={classes.headerIcon} />
        <Typography className={classes.headerTitle}>You offer</Typography>
        <Typography className={classes.headerPrice}>0 items - $0</Typography>
      </div>
      <div
        className={clsx(
          commonClasses.maxHeightTransition,
          classes.content,
          state.expanded && "visible"
        )}
      >
        <div className={classes.commentWrapper}>
          <Typography align="center" className={classes.commentText}>
            Start adding your <span>items you want to trade</span> from your
            inventory
          </Typography>
        </div>
        <MoreDownArrow />
      </div>
    </div>
  );
};
