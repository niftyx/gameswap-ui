import { makeStyles } from "@material-ui/core";
import { ProgressBasicModal, ProgressButton } from "components";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import React, { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { waitSeconds } from "utils";
import { IUserInfo } from "utils/types";

const useStyles = makeStyles((theme) => ({}));

interface IProps {
  visible: boolean;
  values: IUserInfo;
  onClose: () => void;
}

enum EProfileSettingsProgressStep {
  Signing = "Signing",
  Uploading = "Uploading",
}

interface IState {
  step: EProfileSettingsProgressStep;
  loading: boolean;
  error: string;
  signedMessage: string;
}

export const ProfileSettingsProgressModal = (props: IProps) => {
  const { onClose, values, visible } = props;
  const [state, setState] = useState<IState>({
    step: EProfileSettingsProgressStep.Signing,
    loading: false,
    error: "",
    signedMessage: "",
  });
  const { account, library: provider } = useConnectedWeb3Context();
  const { updateUserInfo } = useGlobal();
  const apiService = getAPIService();

  useEffect(() => {
    if (state.step === EProfileSettingsProgressStep.Signing) {
      signMessages();
    } else if (state.step === EProfileSettingsProgressStep.Uploading) {
      updateProfile();
    }
  }, [state.step]);

  const signMessages = async () => {
    if (!provider) {
      onClose();
      return;
    }
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const signedMessage = await provider.getSigner().signMessage(values.name);
      setState((prev) => ({
        ...prev,
        loading: false,
        signedMessage,
        step: EProfileSettingsProgressStep.Uploading,
        error: "",
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  };

  const updateProfile = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await apiService.updateAccountInfo(
        account || "",
        values,
        state.signedMessage
      );
      updateUserInfo(response);
      setState((prev) => ({ ...prev, loading: false, error: "" }));
      onClose();
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  };

  return (
    <ProgressBasicModal
      isStepLoading={false}
      onClose={onClose}
      visible={visible}
    >
      <ProgressButton
        approved={false}
        buttonDisabled={state.loading}
        buttonLoadingText="In Progress..."
        buttonTitle={
          state.loading
            ? "In progress..."
            : state.error
            ? "Try again"
            : "Confirm"
        }
        description="Updating profile"
        errorText={state.error}
        isLoading={state.loading}
        onClick={
          state.step === EProfileSettingsProgressStep.Signing
            ? signMessages
            : updateProfile
        }
        title="Preferences"
      />
    </ProgressBasicModal>
  );
};
