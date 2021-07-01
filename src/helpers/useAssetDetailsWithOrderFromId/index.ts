import { useQuery } from "@apollo/react-hooks";
import { BigNumber } from "packages/ethers";
import { useEffect, useState } from "react";
import { getIPFSService } from "services/ipfs";
import { getLogger } from "utils/logger";
import { queryAssetById } from "utils/queries";
import { toCamelCaseObj } from "utils/token";
import { IAssetItem, IIpfsMainData } from "utils/types";

const logger = getLogger("useAssetDetailsWithOrderFromId");

const wrangleAsset = (e: any) => {
  return {
    ...e,
    assetId: BigNumber.from(e.assetId),
  } as IAssetItem;
};
interface IResponse {
  data: IAssetItem | null;
  loading: boolean;
  load: () => Promise<void>;
}

interface IState {
  asset: IAssetItem | null;
  loading: boolean;
}

interface GraphResponse {
  assets: any[];
}

export const useAssetDetailsWithOrderFromId = (id: string): IResponse => {
  const [state, setState] = useState<IState>({
    asset: null,
    loading: false,
  });

  const { data, error, loading, refetch } = useQuery<GraphResponse>(
    queryAssetById,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      skip: false,
      variables: { id },
    }
  );

  useEffect(() => {
    let isMounted = true;
    const loadAssetDetails = async (asset: IAssetItem) => {
      try {
        const details: IIpfsMainData = (
          await getIPFSService().getData(asset.assetUrl)
        ).data;

        if (isMounted)
          setState((prevState) => ({
            ...prevState,
            loading: false,
            asset: { ...asset, ...details },
          }));
      } catch (error) {
        logger.error(error);
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };
    if (data && data.assets && data.assets.length > 0) {
      const asset = wrangleAsset(toCamelCaseObj(data.assets[0]));
      if (state.asset && state.asset.id === asset.id) return;
      loadAssetDetails(asset);
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [data]);

  const loadAssetInfo = async () => {
    if (refetch) await refetch();
  };

  return { data: state.asset, loading: state.loading, load: loadAssetInfo };
};
