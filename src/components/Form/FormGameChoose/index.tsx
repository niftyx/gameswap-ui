import { Typography, makeStyles } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import clsx from "clsx";
import { GameSelectAutoComplete } from "components/Input";
import { useGlobal } from "contexts";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { IGame } from "utils/types";

import { FormGameChooseItem } from "../FormGameChooseItem";

const useStyles = makeStyles((theme) => ({
  root: {},
  label: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.75),
    marginTop: theme.spacing(1),
  },
  content: {
    marginTop: theme.spacing(2.5),
    display: "flex",
    overflowX: "auto",
    overflowY: "hidden",
    flexWrap: "wrap",
  },
  icon: {
    fontSize: 40,
    color: theme.colors.text.default,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: "50%",
  },
}));

interface IProps {
  comment: string;
  gameIds: string[];
  onChange: (_: string[]) => void;
  onNewGame?: () => void;
  multiple?: boolean;
}

interface IState {
  externalGames: IGame[];
}

export const FormGameChoose = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { comment, gameIds, multiple = false, onChange, onNewGame } = props;
  const {
    data: { games },
  } = useGlobal();
  const [state, setState] = useState<IState>({ externalGames: [] });

  const onSelectFromList = (game?: IGame) => {
    if (!game) {
      onChange([]);
      setState(() => ({ externalGames: [] }));
    } else if (!gameIds.includes(game.id)) {
      if (multiple) {
        onChange([...gameIds, game.id]);
        const defaultGameIds = games.map((g) => g.id);
        setState((prev) => ({
          ...prev,
          externalGames: [...state.externalGames, game].filter(
            (g) => !defaultGameIds.includes(g.id)
          ),
        }));
      } else {
        onChange([game.id]);
        const defaultGameIds = games.map((g) => g.id);
        setState((prev) => ({
          ...prev,
          externalGames: [game].filter((g) => !defaultGameIds.includes(g.id)),
        }));
      }
    }
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.label} component="div">
        {comment}
      </Typography>
      <GameSelectAutoComplete
        onSelect={onSelectFromList}
        preselected={gameIds}
      />
      <div className={clsx(classes.content, commonClasses.scrollHorizontal)}>
        {onNewGame && (
          <FormGameChooseItem
            active={false}
            onClick={onNewGame}
            renderIcon={() => <AddCircleIcon className={classes.icon} />}
            subTitle="Game"
            title="Create"
          />
        )}
        {[...games, ...state.externalGames].map((game) => (
          <FormGameChooseItem
            active={gameIds.includes(game.id)}
            key={game.id}
            onClick={() => {
              if (multiple) {
                if (!gameIds.includes(game.id)) {
                  onChange([...gameIds, game.id]);
                } else {
                  onChange(gameIds.filter((id) => id !== game.id));
                }
              } else {
                if (!gameIds.includes(game.id)) {
                  onChange([game.id]);
                } else {
                  onChange([]);
                }
              }
            }}
            renderIcon={() => (
              <img alt="img" className={classes.img} src={game.imageUrl} />
            )}
            subTitle={" "}
            title={game.name}
          />
        ))}
      </div>
    </div>
  );
};
