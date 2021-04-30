import { useIsMountedRef } from "hooks";
import { useEffect, useState } from "react";
import { getAPIService } from "services/api";
import { IGame } from "utils/types";

interface IState {
  loading: boolean;
  game?: IGame;
}

export const useGameDetailsFromId = (
  id?: string
): IState & {
  loadGameInfo: () => Promise<void>;
} => {
  const [state, setState] = useState<IState>({
    loading: true,
  });
  const apiService = getAPIService();
  const isMounted = useIsMountedRef();

  const loadGameInfo = async (): Promise<void> => {
    if (!id) return;
    setState(() => ({ loading: true }));
    try {
      const game = await apiService.getGame(id);
      if (isMounted.current === true)
        setState(() => ({ game, loading: false }));
      return;
    } catch (error) {
      setState(() => ({ loading: false }));
      return;
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
