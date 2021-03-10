import { makeStyles } from "@material-ui/core";
import { PageBackButton, PageContainer, PageTitle } from "components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IGame } from "utils/types";

import { GameCreateForm, GameProgressModal } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "auto",
  },
  content: {
    maxWidth: 700,
    padding: `0px ${theme.spacing(2.5)}px`,
  },
}));

interface IState {
  formValues?: IGame;
  visible: boolean;
}

const CreateGamePage = () => {
  const classes = useStyles();
  const history = useHistory();

  const [state, setState] = useState<IState>({
    visible: false,
  });

  const onBack = () => {
    history.push("/create");
  };

  const onSubmit = (formValues: IGame) => {
    setState((prevState) => ({
      ...prevState,
      formValues,
      visible: true,
    }));
  };

  const onCloseModal = () => {
    setState((prevState) => ({
      ...prevState,
      formValues: undefined,
      visible: false,
    }));
  };

  return (
    <PageContainer className={classes.root}>
      <div className={classes.content}>
        <PageBackButton onBack={onBack} title="Back" />
        <PageTitle title="Add Game" />
        <GameCreateForm onSubmit={onSubmit} />
        {state.visible && state.formValues && (
          <GameProgressModal
            formValues={state.formValues}
            onClose={onCloseModal}
            visible={state.visible}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default CreateGamePage;
