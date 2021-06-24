import { useIsMountedRef } from "hooks";
import { BigNumber } from "packages/ethers";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { getIPFSService } from "services/ipfs";
import { EFileType } from "utils/enums";
import { getLogger } from "utils/logger";
import { IAssetItem } from "utils/types";

const logger = getLogger("useAssetDetailsFromIdCollection");

interface IResponse {
  data: IAssetItem | null;
  loading: boolean;
}

interface IState {
  asset: IAssetItem | null;
  loading: boolean;
}

export const useAssetDetailsFromIdCollection = (
  tokenId: BigNumber,
  collectionId: string
): IResponse => {
  const isRefMounted = useIsMountedRef();
  const apiService = getAPIService();

  const [state, setState] = useState<IState>({
    asset: null,
    loading: false,
  });

  const refetch = async () => {
    const response = await apiService.getAssetDetailsWithAssetIdAndCollectionId(
      tokenId,
      collectionId
    );
    if (isRefMounted.current === true && response) {
      setState((prev) => ({
        ...prev,
        asset: {
          ...(response as any),
          collectionId: response.collection.id,
          tokenId: BigNumber.from(response.assetId.hex),
          tokenURL: response.assetURL,
          owner: response.currentOwner.id,
          name: "",
          description: "",
          image: "",
          imageType: EFileType.Unknown,
        },
      }));
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenId, collectionId]);

  useEffect(() => {
    let isMounted = true;
    const loadAssetDetails = async () => {
      if (!state.asset || !state.asset.assetUrl) return;
      try {
        const details = (await getIPFSService().getData(state.asset.assetUrl))
          .data;
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
    if (
      state.asset &&
      state.asset.assetId.eq(tokenId) &&
      state.asset.collectionId === collectionId &&
      !state.asset.name
    ) {
      loadAssetDetails();
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [state.asset]);

  return { data: state.asset, loading: state.loading };
};
