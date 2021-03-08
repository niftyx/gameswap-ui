import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { IUserInfo } from "utils/types";

import {
  ProfileSettingsForm,
  ProfileSettingsProgressModal,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    maxWidth: 815,
    margin: "0 auto",
    padding: "32px 0",
    overflowY: "auto",
  },
  content: {
    padding: `0px ${theme.spacing(4)}px`,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down(768)]: {
      padding: `0px ${theme.spacing(3)}px`,
    },
    [theme.breakpoints.down(600)]: {
      padding: `0px ${theme.spacing(2)}px`,
    },
  },
}));

interface IState {
  visible: boolean;
  value?: IUserInfo;
}

const ProfileSettingsPage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const [state, setState] = useState<IState>({ visible: false });

  const onSubmit = (payload: IUserInfo) => {
    setState({
      visible: true,
      value: payload,
    });
  };

  return (
    <div className={clsx(classes.root, commonClasses.scroll)}>
      <div className={classes.content}>
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
    </div>
  );
};

export default ProfileSettingsPage;
