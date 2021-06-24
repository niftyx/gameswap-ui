import {
  DEFAULT_NETWORK_ID,
  INVENTORY_PAGE_ASSET_COUNT,
} from "config/constants";
import { getHasuraServerUrl } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks";
import { BigNumber } from "packages/ethers";
import { useEffect, useState } from "react";
import { IGraphInventoryAsset } from "types";
import { fetchQuery } from "utils/graphql";
import { getLogger } from "utils/logger";
import { queryAssetsByGameId } from "utils/queries";
import { toCamelCaseObj } from "utils/token";

const logger = getLogger("useInventoryAssets:");

const wrangleAsset = (e: any) => {
  return {
    ...e,
    assetId: BigNumber.from(e.assetId),
  } as IGraphInventoryAsset;
};
interface IState {
  hasMore: boolean;
  assets: IGraphInventoryAsset[];
  loading: boolean;
}

export const useAssetsFromGameId = (
  id: string
): {
  hasMore: boolean;
  assets: IGraphInventoryAsset[];
  loadMore: () => Promise<void>;
  loading: boolean;
} => {
  const isRefMounted = useIsMountedRef();
  const [state, setState] = useState<IState>({
    hasMore: false,
    assets: [],
    loading: true,
  });
  const { networkId } = useConnectedWeb3Context();
  const hasura = getHasuraServerUrl(networkId || DEFAULT_NETWORK_ID);

  const fetchData = async (variables: {
    perPage: number;
    page: number;
    id: string;
  }) => {
    try {
      const { id, page, perPage } = variables;
      setState((prevState) => ({ ...prevState, loading: true }));

      const response: any = (
        await fetchQuery(
          queryAssetsByGameId,
          { offset: (page - 1) * perPage, limit: perPage + 1, id },
          hasura.httpUri
        )
      ).data;
      logger.log("===hhh===", response);
      if (isRefMounted.current === false) return;
      if (response.data && response.data.assets) {
        const hasMore = response.data.assets.length === perPage + 1;
        const records = response.data.assets
          .slice(0, perPage)
          .map((e: any) => toCamelCaseObj(e))
          .map((e: any) => wrangleAsset(e));
        setState((prevState) => ({
          ...prevState,
          hasMore,
          assets: [...prevState.assets, ...records],
          loading: false,
        }));
      } else {
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    } catch (error) {
      logger.error("fetchData:", error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const loadMore = async () => {
    await fetchData({
      perPage: INVENTORY_PAGE_ASSET_COUNT,
      page: Math.floor(state.assets.length / INVENTORY_PAGE_ASSET_COUNT) + 1,
      id,
    });
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      hasMore: false,
      assets: [],
    }));
    if (id) {
      fetchData({
        perPage: INVENTORY_PAGE_ASSET_COUNT,
        page: 1,
        id,
      });
    }

    // eslint-disable-next-line
  }, [id]);

  return {
    assets: state.assets,
    hasMore: state.hasMore,
    loadMore,
    loading: state.loading,
  };
};
