import { CircularProgress, Typography, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import { useCollectionsFromGameId } from "helpers";
import React from "react";
import { NavLink } from "react-router-dom";
import useCommonStyles from "styles/common";

import { CollectionItem } from "../CollectionItem";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: 4,
    overflowX: "auto",
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 32,
    },
  },
  loadWrapper: {
    width: "100%",
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  create: {
    display: "inline-flex",
    height: 32,
    minWidth: 150,
    textDecoration: "none",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 16px",
    backgroundColor: theme.colors.purple60,
    color: theme.colors.white,
    borderRadius: 4,
    transition: "all 0.4s",
    fontSize: 13,
    "&:hover": {
      backgroundColor: theme.colors.purple40,
    },
  },
  noWrapper: {
    width: "100%",
    border: `1px solid ${theme.colors.primary85}`,
    textAlign: "center",
    padding: 40,
    borderRadius: 4,
    "& > *+*": {
      marginTop: 8,
    },
  },
  noIcon: {},
  noTitle: { color: theme.colors.primary40, fontSize: 14 },
  noDescription: { color: theme.colors.primary70, fontSize: 13 },
}));

interface IProps {
  className?: string;
  gameId: string;
}

export const CollectionsSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { gameId } = props;
  const { collections, loading } = useCollectionsFromGameId(gameId);

  return (
    <div
      className={clsx(
        classes.root,
        props.className,
        commonClasses.scrollHorizontal
      )}
    >
      {loading && (
        <div className={classes.loadWrapper}>
          <CircularProgress color="primary" size={40} />
        </div>
      )}
      {!loading && collections.length === 0 && (
        <div className={classes.noWrapper}>
          <img
            alt="icon"
            className={classes.noIcon}
            src="/svgs/icons/skull.svg"
          />
          <Typography className={classes.noTitle}>No Collections</Typography>
          <Typography className={classes.noDescription}>
            Looks like there are no collections for this game
          </Typography>
          <NavLink className={clsx(classes.create)} to="/create/collection">
            <AddIcon />
            &nbsp; Create Collection
          </NavLink>
        </div>
      )}
      {!loading && collections.length > 0 && (
        <>
          {collections.map((collection) => (
            <CollectionItem collection={collection} key={collection.id} />
          ))}
        </>
      )}
    </div>
  );
};
