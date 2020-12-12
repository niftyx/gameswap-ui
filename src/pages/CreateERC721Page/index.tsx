import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageBackButton, PageContainer, PageTitle } from "components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  ERC721CreateForm,
  ERC721ProgressModal,
  IFormValues,
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
  formValues?: IFormValues;
  visible: boolean;
}

const CreateERC721Page = () => {
  const classes = useStyles();
  const history = useHistory();

  const [state, setState] = useState<IState>({
    visible: false,
  });

  const onBack = () => {
    history.push("/create");
  };

  const onSubmit = (formValues: IFormValues) => {
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
        <PageBackButton onBack={onBack} title="Manage Asset Type" />
        <PageTitle title="Create single asset" />
        <ERC721CreateForm onSubmit={onSubmit} />
        {state.visible && state.formValues && (
          <ERC721ProgressModal
            formValues={state.formValues}
            onClose={onCloseModal}
            steps={
              state.formValues.instantSale
                ? (Object.values(ECreateStep) as Array<ECreateStep>)
                : [
                    ECreateStep.ApproveAll,
                    ECreateStep.UploadFiles,
                    ECreateStep.MintToken,
                  ]
            }
            visible={state.visible}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default CreateERC721Page;
