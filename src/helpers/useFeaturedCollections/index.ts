import { DEFAULT_NETWORK_ID } from "config/constants";
import { getHasuraServerUrl } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks";
import { BigNumber } from "packages/ethers";
import React, { useEffect, useState } from "react";
import { fetchQuery } from "utils/graphql";
import { getLogger } from "utils/logger";
import { queryFeaturedAndPublicCollections } from "utils/queries";
import { toCamelCaseObj } from "utils/token";
import { ICollection } from "utils/types";

const logger = getLogger("useFeaturedCollections::");

const wrangeCollection = (e: any): ICollection => {
  return {
    ...e,
    totalMinted: BigNumber.from(e.totalMinted || "0"),
    totalBurned: BigNumber.from(e.totalBurned || "0"),
    totalSupply: BigNumber.from(e.totalSupply || "0"),
  };
};

interface IState {
  collections: ICollection[];
}

const PERPAGE = 20;

export const useFeaturedCollections = () => {
  const isMountedRef = useIsMountedRef();
  const { networkId } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({ collections: [] });
  const hasura = getHasuraServerUrl(networkId || DEFAULT_NETWORK_ID);

  const loadAll = async () => {
    const collections: any[] = [];
    let hasMore = true;
    while (hasMore) {
      try {
        const response: any = (
          await fetchQuery(
            queryFeaturedAndPublicCollections,
            { offset: collections.length, limit: PERPAGE },
            hasura.httpUri
          )
        ).data;
        if (response.data && response.data.collections) {
          collections.push(
            ...response.data.collections.map((e: any) =>
              wrangeCollection(toCamelCaseObj(e))
            )
          );
          hasMore = response.data.collections.length > PERPAGE;
        } else {
          hasMore = false;
        }
      } catch (error) {
        hasMore = false;
        logger.error(error);
      }
    }

    if (isMountedRef.current === true) {
      setState((prev) => ({ ...prev, collections }));
    }
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, collections: [] }));
    loadAll();
  }, [networkId]);

  return { ...state, reload: loadAll };
};
