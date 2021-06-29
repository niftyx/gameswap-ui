import { useQuery } from "@apollo/react-hooks";
import { useIsMountedRef } from "hooks";
import { BigNumber } from "packages/ethers";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { getIPFSService } from "services/ipfs";
import { EFileType } from "utils/enums";
import { getLogger } from "utils/logger";
import { queryAssetsByAssetIdAndCollectionId } from "utils/queries";
import { toCamelCaseObj } from "utils/token";
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

interface GraphResponse {
  assets: any[];
}

export const useAssetDetailsFromIdCollection = (
  assetId: BigNumber,
  collectionId: string
): IResponse => {
  const { data, error, loading } = useQuery<GraphResponse>(
    queryAssetsByAssetIdAndCollectionId,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      skip: false,
      variables: { assetId: assetId.toHexString(), collectionId },
    }
  );

  const [state, setState] = useState<IState>({
    asset: null,
    loading: false,
  });

  useEffect(() => {
    if (data && data.assets.length > 0) {
      const response = toCamelCaseObj(data.assets[0]);
      setState((prev) => ({
        ...prev,
        asset: {
          ...(response as any),
          assetId: BigNumber.from(response.assetId),
          name: "",
          description: "",
          image: "",
          imageType: EFileType.Unknown,
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
      state.asset.assetId.eq(assetId) &&
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

  return { data: state.asset, loading: state.loading || loading };
};
