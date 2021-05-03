import { CircularProgress, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { GameCreateModal } from "components";
import { useGameDetailsFromId } from "helpers";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useCommonStyles from "styles/common";

import {
  AssetsSection,
  CollectionsSection,
  HeroSection,
  SectionHeader,
} from "./components";

const useStyles = makeStyles((theme) => ({
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

interface IState {
  gameEditModalVisible: boolean;
}

interface IProps {
  gameId: string;
}

export const GameDetailsPageContent = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { gameId } = props;
  const [state, setState] = useState<IState>({
    gameEditModalVisible: false,
  });
  const setGameEditModalVisible = (gameEditModalVisible: boolean) => {
    setState((prev) => ({
      ...prev,
      gameEditModalVisible,
    }));
  };

  const history = useHistory();

  const {
    game: gameInfo,
    loadGameInfo,
    loading: gameLoading,
  } = useGameDetailsFromId(gameId);

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

  const onEditGame = () => {
    if (!gameInfo) return;
    setGameEditModalVisible(true);
  };

  return (
    <div className={clsx(classes.content, commonClasses.scroll)}>
      {gameLoading && (
        <div className={classes.loadWrapper}>
          <CircularProgress size={40} />
        </div>
      )}
      {!gameLoading && gameInfo && (
        <>
          <HeroSection
            className={classes.heroSection}
            game={gameInfo}
            onEditGame={onEditGame}
          />
          <SectionHeader href="/create/collection" title="Collections" />
          <CollectionsSection
            className={classes.section}
            gameId={gameInfo.id}
          />
          <SectionHeader href="/create/erc721" title="Assets" />
          <AssetsSection className={classes.section} gameId={gameInfo.id} />
        </>
      )}
      {state.gameEditModalVisible && (
        <GameCreateModal
          game={gameInfo}
          onClose={() => setGameEditModalVisible(false)}
          onSuccess={loadGameInfo}
          visible={state.gameEditModalVisible}
        />
      )}
    </div>
  );
};
