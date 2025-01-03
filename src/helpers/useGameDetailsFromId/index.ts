import { useQuery } from "@apollo/client";
import { queryGameById } from "utils/queries";
import { toCamelCaseObj } from "utils/token";
import { IGame } from "utils/types";

interface GraphResponse {
  games: any[];
}

export const useGameDetailsFromId = (
  id?: string
): {
  game?: IGame;
  loadGameInfo: () => Promise<void>;
  loading: boolean;
} => {
  const { data, error, loading, refetch } = useQuery<GraphResponse>(
    queryGameById,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      skip: false,
      variables: { id },
    }
  );

  const loadGameInfo = async () => {
    await refetch();
  };

  let game: any = undefined;

  if (data && data.games.length > 0) {
    game = toCamelCaseObj(data.games[0]);
  }

  return { loading, loadGameInfo, game };
};
