import { makeStyles } from "@material-ui/core";
import { PageBackButton, PageContainer, PageTitle } from "components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ICollection } from "utils/types";

import { CollectionCreateForm, CollectionProgressModal } from "./components";

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
  formValues?: ICollection;
  visible: boolean;
}

const CreateCollectionPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const [state, setState] = useState<IState>({
    visible: false,
  });

  const onBack = () => {
    history.push("/create");
  };

  const onSubmit = (formValues: ICollection) => {
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
        <PageTitle title="Add Collection" />
        <CollectionCreateForm onSubmit={onSubmit} />
        {state.visible && state.formValues && (
          <CollectionProgressModal
            formValues={state.formValues}
            onClose={onCloseModal}
            visible={state.visible}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default CreateCollectionPage;
