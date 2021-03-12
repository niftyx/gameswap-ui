import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { getLogger } from "utils/logger";
import { IGame, Maybe } from "utils/types";

const logger = getLogger("useGameDetailsFromId::");

interface IState {
  loading: boolean;
  game?: IGame;
}

export const useGameDetailsFromId = (
  id?: string
): IState & {
  loadGameInfo: () => Promise<Maybe<IGame>>;
} => {
  const [state, setState] = useState<IState>({
    loading: true,
  });
  const apiService = getAPIService();
  const isMounted = useIsMountedRef();

  const loadGameInfo = async (): Promise<Maybe<IGame>> => {
    if (!id) return null;
    setState(() => ({ loading: true }));
    try {
      const game = await apiService.getGame(id);
      if (isMounted.current === true)
        setState(() => ({ game, loading: false }));
      return game;
    } catch (error) {
      setState(() => ({ loading: false }));
      return null;
    }
  };

  useEffect(() => {
    if (id) {
      loadGameInfo();
    } else {
      setState({ loading: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { ...state, loadGameInfo };
};
