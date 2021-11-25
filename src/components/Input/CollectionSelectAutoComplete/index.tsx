import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useState } from "react";
import { getAPIService } from "services/api";
import { ICollection } from "utils/types";

import { AsyncAutoCompleteInput } from "../AsyncAutoCompleteInput";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 16,
  },
}));

interface IProps {
  className?: string;
  onSelect: (_?: ICollection) => void;
  preselected: string[];
}

interface IState {
  collections: ICollection[];
}

export const CollectionSelectAutoComplete = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    collections: [],
  });
  const { preselected } = props;
  const apiService = getAPIService();

  const getOptions = async (keyword: string) => {
    let options: any = [];
    try {
      const collections = await apiService.searchCollections(keyword);

      setState((prev) => ({ ...prev, collections }));
      options = collections.map((g: any) => ({
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
    const selectedGame = state.collections.find((g) => g.id === id);

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
