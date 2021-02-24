import { makeStyles } from "@material-ui/core";
import {
  CollectionCreateModal,
  GameCreateModal,
  PageBackButton,
  PageContainer,
  PageTitle,
} from "components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  ERC721CreateForm,
  ERC721ProgressModal,
  IERC721FormValues,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "auto",
  },
  content: {
    margin: "auto",
    maxWidth: 815,
    padding: `0px ${theme.spacing(2.5)}px`,
  },
}));

export enum ECreateStep {
  ApproveAll,
  UploadFiles,
  MintToken,
  SignSellOrder,
}

interface IState {
  formValues?: IERC721FormValues;
  visible: boolean;
  collectionModalVisible: boolean;
  gameModalVisible: boolean;
}

const CreateERC721Page = () => {
  const classes = useStyles();
  const history = useHistory();

  const [state, setState] = useState<IState>({
    visible: false,
    collectionModalVisible: false,
    gameModalVisible: false,
  });

  const onBack = () => {
    history.push("/create");
  };

  const onSubmit = (formValues: IERC721FormValues) => {
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

  const toggleCollectionModal = () => {
    setState((prevState) => ({
      ...prevState,
      collectionModalVisible: !prevState.collectionModalVisible,
    }));
  };

  const toggleGameModal = () => {
    setState((prevState) => ({
      ...prevState,
      gameModalVisible: !prevState.gameModalVisible,
    }));
  };

  return (
    <PageContainer className={classes.root}>
      <div className={classes.content}>
        <PageBackButton onBack={onBack} title="Manage Asset Type" />
        <PageTitle title="Create single asset" />
        <ERC721CreateForm
          onNewCollection={toggleCollectionModal}
          onNewGame={toggleGameModal}
          onSubmit={onSubmit}
        />
        {state.visible && state.formValues && (
          <ERC721ProgressModal
            formValues={state.formValues}
            onClose={onCloseModal}
            steps={
              state.formValues.instantSale
                ? (Object.values(ECreateStep) as Array<ECreateStep>)
                : [ECreateStep.UploadFiles, ECreateStep.MintToken]
            }
            visible={state.visible}
          />
        )}
      </div>
      {state.collectionModalVisible && (
        <CollectionCreateModal
          onClose={toggleCollectionModal}
          visible={state.collectionModalVisible}
        />
      )}
      {state.gameModalVisible && (
        <GameCreateModal
          onClose={toggleGameModal}
          visible={state.gameModalVisible}
        />
      )}
    </PageContainer>
  );
};

export default CreateERC721Page;
