import { ProgressBasicModal, ProgressButton } from "components";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import React, { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { IGame } from "utils/types";

interface IProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (id: string) => void;
  formValues: IGame;
}

enum ECurrentStep {
  Signing = "Signing",
  Uploading = "Uploading",
}
interface IState {
  loading: boolean;
  step: ECurrentStep;
  error: string;
  signingVisible: boolean;
}

export const GameProgressModal = (props: IProps) => {
  const context = useConnectedWeb3Context();
  const { authToken, fetchAuthToken, library: provider, networkId } = context;
  const { loadGames } = useGlobal();

  const { formValues, onClose, onSuccess, visible } = props;
  const [state, setState] = useState<IState>({
    loading: false,
    step: ECurrentStep.Signing,
    error: "",
    signingVisible: !authToken,
  });
  const apiService = getAPIService(networkId);

  useEffect(() => {
    if (state.signingVisible || Date.now() > (authToken?.expires_at || 0)) {
      signMessage();
    } else {
      setState((prev) => ({ ...prev, step: ECurrentStep.Uploading }));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (state.step === ECurrentStep.Uploading) {
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
      await fetchAuthToken();
      setState((prev) => ({
        ...prev,
        loading: false,
        step: ECurrentStep.Uploading,
        error: "",
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  };

  const createGame = async () => {
    if (!authToken) return;
    setState((prev) => ({ ...prev, loading: true }));
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      if (authToken.expires_at < Date.now()) {
        await fetchAuthToken();
      }
      const { id, ...payload } = formValues;
      const game = await apiService.createGame(
        {
          ...payload,
          headerImageUrl: formValues.headerImageUrl || "",
        },
        authToken
      );
      await loadGames();
      setState((prev) => ({ ...prev, loading: false, error: "" }));

      onSuccess(game.id);
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
      {state.signingVisible && (
        <ProgressButton
          approved={state.step === ECurrentStep.Uploading}
          buttonDisabled={state.step !== ECurrentStep.Signing}
          buttonLoadingText="Follow wallet instructions"
          buttonTitle={state.step === ECurrentStep.Signing ? "Sign" : "Signed"}
          description="Prepare files for minting"
          errorText={state.step === ECurrentStep.Signing ? state.error : ""}
          isLoading={
            state.step === ECurrentStep.Signing ? state.loading : false
          }
          onClick={signMessage}
          title={`Signing Message ...`}
        />
      )}
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
