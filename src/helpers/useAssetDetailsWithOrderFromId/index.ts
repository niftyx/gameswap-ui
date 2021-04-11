import { useIsMountedRef } from "hooks";
import { BigNumber } from "packages/ethers";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { getIPFSService } from "services/ipfs";
import { getLogger } from "utils/logger";
import { IAssetItem, IIpfsMainData } from "utils/types";

const logger = getLogger("useAssetDetailsWithOrderFromId");

interface IResponse {
  data: IAssetItem | null;
  loading: boolean;
  load: () => Promise<void>;
}

interface IState {
  asset: IAssetItem | null;
  loading: boolean;
}

export const useAssetDetailsWithOrderFromId = (id: string): IResponse => {
  const [state, setState] = useState<IState>({
    asset: null,
    loading: false,
  });
  const isRefMounted = useIsMountedRef();

  const apiService = getAPIService();

  const loadAssetInfo = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const response = await apiService.getAssetDetails(id);
    if (isRefMounted.current === false) return;
    if (response) {
      setState((prev) => ({
        ...prev,
        loading: false,
        asset: {
          ...(response as any),
          owner: response.currentOwner.id,
          creator: response.creator.id,
          collectionId: response.collection.id,
          tokenId: BigNumber.from(response.assetId.hex),
          tokenURL: response.assetURL,
        },
      }));
    } else {
      setState((prev) => ({ ...prev, loading: false, asset: null }));
    }
  };

  useEffect(() => {
    loadAssetInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    const loadAssetDetails = async () => {
      if (!state.asset || !state.asset.tokenURL || !state.asset.tokenId) return;
      try {
        const details: IIpfsMainData = (
          await getIPFSService().getData(state.asset.tokenURL)
        ).data;

        if (isMounted)
          setState((prevState) => ({
            ...prevState,
            loading: false,
            asset: prevState.asset
              ? {
                  ...prevState.asset,
                  ...details,
                }
              : null,
          }));
      } catch (error) {
        logger.error(error);
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };
    if (state.asset && state.asset.id === id && !state.asset.name) {
      loadAssetDetails();
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [state.asset?.id]);

  return { data: state.asset, loading: state.loading, load: loadAssetInfo };
};
