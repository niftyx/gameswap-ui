import { makeStyles } from "@material-ui/core";
import { PageBackButton, PageContainer, PageTitle } from "components";
import { useConnectedWeb3Context } from "contexts";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { IUserInfo } from "utils/types";

import {
  ProfileSettingsForm,
  ProfileSettingsProgressModal,
} from "./components";

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
  visible: boolean;
  value?: IUserInfo;
}

const ProfileSettingsPage = () => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ visible: false });
  const history = useHistory();
  const { account } = useConnectedWeb3Context();

  const onSubmit = (payload: IUserInfo) => {
    setState({
      visible: true,
      value: payload,
    });
  };

  const onBack = () => {
    history.push(`/users/${account}/assets`);
  };

  return (
    <PageContainer className={classes.root}>
      <div className={classes.content}>
        <PageBackButton onBack={onBack} title="Back" />
        <PageTitle title="Settings" />
        <ProfileSettingsForm onSubmit={onSubmit} />
        {state.value && state.visible && (
          <ProfileSettingsProgressModal
            onClose={() => {
              setState({ visible: false });
            }}
            values={state.value}
            visible={state.visible}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default ProfileSettingsPage;
