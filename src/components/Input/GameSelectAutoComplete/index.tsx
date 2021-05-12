import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useState } from "react";
import { getAPIService } from "services/api";
import { IGame } from "utils/types";

import { AsyncAutoCompleteInput } from "../AsyncAutoCompleteInput";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    marginTop: 16,
  },
}));

interface IProps {
  className?: string;
  onSelect: (_?: IGame) => void;
  preselected: string[];
}

interface IState {
  games: IGame[];
}

export const GameSelectAutoComplete = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    games: [],
  });
  const { preselected } = props;
  const apiService = getAPIService();

  const getOptions = async (keyword: string) => {
    let options: any = [];
    try {
      const games = await apiService.searchGames(keyword);

      setState((prev) => ({ ...prev, games }));
      options = games.map((g: any) => ({
        label: g.name,
        value: g.id,
        image: g.imageUrl,
      }));
    } catch (error) {
      console.warn(error);
    }

    return options;
  };

  const onSelect = (id?: string) => {
    const selectedGame = state.games.find((g) => g.id === id);

    props.onSelect(selectedGame);
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <AsyncAutoCompleteInput
        getOptions={getOptions}
        onSelect={onSelect}
        preselected={preselected}
      />
    </div>
  );
};
