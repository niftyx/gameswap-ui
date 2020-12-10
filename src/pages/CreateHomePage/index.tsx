import { makeStyles } from "@material-ui/core";
import { PageContainer } from "components";
import React from "react";

import { AssetCreateOption } from "./components";

const useStyles = makeStyles((theme) => ({
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
      <AssetCreateOption link="/create/erc721" title="Single" />
    </PageContainer>
  );
};

export default CreateHomePage;
