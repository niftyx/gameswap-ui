import { makeStyles } from "@material-ui/core";
import { PageContainer } from "components";
import React from "react";

import { AssetCreateOption } from "./components";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const CreateHomePage = () => {
  const classes = useStyles();
  return (
    <PageContainer className={classes.root}>
      <AssetCreateOption link="/create/erc721" title="Asset" />
      <AssetCreateOption link="/create/collection" title="Collection" />
      <AssetCreateOption link="/create/game" title="Game" />
    </PageContainer>
  );
};

export default CreateHomePage;
