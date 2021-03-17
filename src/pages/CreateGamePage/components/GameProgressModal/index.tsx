import { ProgressBasicModal, ProgressButton } from "components";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import React, { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { IGame } from "utils/types";

interface IProps {
  visible: boolean;
  onClose: () => void;
  formValues: IGame;
}

enum ECurrentStep {
  Signing = "Signing",
  Uploading = "Uploading",
}
interface IState {
  loading: boolean;
  step: ECurrentStep;
  message: string;
  error: string;
}

export const GameProgressModal = (props: IProps) => {
  const context = useConnectedWeb3Context();
  const { library: provider } = context;
  const { loadGames } = useGlobal();

  const { formValues, onClose, visible } = props;
  const [state, setState] = useState<IState>({
    loading: false,
    step: ECurrentStep.Signing,
    message: "",
    error: "",
  });
  const apiService = getAPIService();

  useEffect(() => {
    if (state.step === ECurrentStep.Signing) {
      signMessage();
    } else {
      createGame();
    }
    // eslint-disable-next-line
  }, [state.step]);

  const signMessage = async () => {
    if (!provider) {
      onClose();
      return;
    }
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const message = await provider.getSigner().signMessage(formValues.name);
      setState((prev) => ({
        ...prev,
        loading: false,
        message,
        step: ECurrentStep.Uploading,
        error: "",
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  };

  const createGame = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...payload } = formValues;
      await apiService.createGame({
        ...payload,
        message: state.message,
        headerImageUrl: formValues.headerImageUrl || "",
      });
      await loadGames();
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
        approved={state.step === ECurrentStep.Uploading}
        buttonDisabled={state.step !== ECurrentStep.Signing}
        buttonLoadingText="Follow wallet instructions"
        buttonTitle={state.step === ECurrentStep.Signing ? "Sign" : "Signed"}
        description="Prepare files for minting"
        errorText={state.step === ECurrentStep.Signing ? state.error : ""}
        isLoading={state.step === ECurrentStep.Signing ? state.loading : false}
        onClick={signMessage}
        title={`Signing Message ...`}
      />
      <ProgressButton
        approved={state.step === ECurrentStep.Uploading}
        buttonDisabled={state.step !== ECurrentStep.Uploading}
        buttonLoadingText="Creating game ..."
        buttonTitle={"Create"}
        description="Creating game ..."
        errorText={state.step === ECurrentStep.Uploading ? state.error : ""}
        isLoading={
          state.step === ECurrentStep.Uploading ? state.loading : false
        }
        onClick={createGame}
        title={`Creating game ...`}
      />
    </ProgressBasicModal>
  );
};
