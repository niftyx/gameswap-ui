import { CircularProgress, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PageContainer } from "components";
import { useGameDetailsFromId } from "helpers";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import useCommonStyles from "styles/common";

import {
  AssetsSection,
  CollectionsSection,
  HeroSection,
  SectionHeader,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "auto",
  },
  content: {
    height: "100%",
  },
  heroSection: {
    minHeight: "50%",
    marginLeft: -theme.spacing(2),
    marginRight: -theme.spacing(2),
    marginTop: -theme.spacing(2),
  },
  section: {
    marginBottom: 16,
  },
  loadWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "40vh",
    padding: 24,
  },
}));

const GameDetailsPage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const params = useParams();
  const history = useHistory();
  const gameId = ((params || {}) as any).id as string;

  const { game: gameInfo, loading: gameLoading } = useGameDetailsFromId(
    gameId || ""
  );

  useEffect(() => {
    if (!gameId) {
      history.push("/");
      return;
    }
    if (!gameLoading && !gameInfo) {
      history.push("/");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, gameInfo, gameLoading]);

  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        {gameLoading && (
          <div className={classes.loadWrapper}>
            <CircularProgress size={40} />
          </div>
        )}
        {!gameLoading && gameInfo && (
          <>
            <HeroSection className={classes.heroSection} game={gameInfo} />
            <SectionHeader href="/create/collection" title="Collections" />
            <CollectionsSection
              className={classes.section}
              gameId={gameInfo.id}
            />
            <SectionHeader href="/create/erc721" title="Assets" />
            <AssetsSection className={classes.section} gameId={gameInfo.id} />
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default GameDetailsPage;
