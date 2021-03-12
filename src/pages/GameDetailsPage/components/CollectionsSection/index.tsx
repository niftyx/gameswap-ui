import { CircularProgress, makeStyles } from "@material-ui/core";
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
    height: theme.spacing(4.5),
    minWidth: 180,
    textDecoration: "none",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 16px",
  },
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
        <NavLink
          className={clsx(classes.create, commonClasses.transparentButton)}
          to="/create/collection"
        >
          Create Collection
        </NavLink>
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
