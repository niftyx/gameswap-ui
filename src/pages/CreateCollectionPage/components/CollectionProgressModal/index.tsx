import { ProgressBasicModal, ProgressButton } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getContractAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import React, { useEffect, useState } from "react";
import { ERC721FactoryService } from "services";
import { waitSeconds } from "utils";
import { getLogger } from "utils/logger";
import { ICollection } from "utils/types";

const logger = getLogger("CollectionProgressModal::Modal");

interface IProps {
  visible: boolean;
  onClose: () => void;
  formValues: ICollection;
}

interface IState {
  loading: boolean;
  message: string;
  error: string;
}

export const CollectionProgressModal = (props: IProps) => {
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const gswap721FactoryAddress = getContractAddress(
    networkId || DEFAULT_NETWORK_ID,
    "erc721Factory"
  );
  const factoryContract = new ERC721FactoryService(
    provider,
    account,
    gswap721FactoryAddress
  );
  const { loadCollections } = useGlobal();
  const { formValues, onClose, visible } = props;
  const [state, setState] = useState<IState>({
    loading: false,
    message: "",
    error: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    createCollection();
    // eslint-disable-next-line
  }, []);

  const createCollection = async () => {
    if (!provider) {
      onClose();
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const txResult = await factoryContract.createGswap721(
        formValues.name,
        formValues.symbol,
        formValues.imageUrl,
        formValues.description || "",
        formValues.isPrivate
      );
      logger.log(txResult);
      await waitSeconds(5);
      await loadCollections();
      setState((prev) => ({ ...prev, loading: false }));
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
        buttonDisabled={false}
        buttonLoadingText="Follow wallet instructions"
        buttonTitle={"Create Collection"}
        description="Create ERC721 Contract..."
        errorText={state.error}
        isLoading={state.loading}
        onClick={createCollection}
        title={`Create Collection ...`}
      />
    </ProgressBasicModal>
  );
};
