import { DEFAULT_NETWORK_ID } from "config/constants";
import { getHasuraServerUrl } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef } from "hooks";
import React, { useEffect, useState } from "react";
import { fetchQuery } from "utils/graphql";
import { queryFeaturedGames } from "utils/queries";
import { toCamelCaseObj } from "utils/token";
import { IGame } from "utils/types";

interface IState {
  games: IGame[];
}

const PERPAGE = 20;

export const useFeaturedGames = () => {
  const isMountedRef = useIsMountedRef();
  const { networkId } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({ games: [] });
  const hasura = getHasuraServerUrl(networkId || DEFAULT_NETWORK_ID);

  const loadAll = async () => {
    const games: any[] = [];
    let hasMore = true;
    while (hasMore) {
      const response: any = (
        await fetchQuery(
          queryFeaturedGames,
          { offset: games.length, limit: PERPAGE },
          hasura.httpUri
        )
      ).data;

      if (response.data && response.data.games) {
        games.push(...response.data.games.map((e: any) => toCamelCaseObj(e)));
        hasMore = response.data.games.length > PERPAGE;
      } else {
        hasMore = false;
      }
    }
    if (isMountedRef.current === true) {
      setState((prev) => ({ ...prev, games }));
    }
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, games: [] }));
    loadAll();
  }, [networkId]);

  return { ...state, reload: loadAll };
};
