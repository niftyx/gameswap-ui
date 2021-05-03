import { makeStyles } from "@material-ui/core";
import { PageContainer } from "components";
import React from "react";
import { useParams } from "react-router";

import { GameDetailsPageContent } from "./GameDetailsPageContent";

const useStyles = makeStyles(() => ({
  root: {
    height: "auto",
  },
}));

const GameDetailsPage = () => {
  const classes = useStyles();

  const params = useParams();

  const gameId = (((params || {}) as any).id as string).toLowerCase();

  return (
    <PageContainer className={classes.root}>
      <GameDetailsPageContent gameId={gameId || ""} />
    </PageContainer>
  );
};

export default GameDetailsPage;
