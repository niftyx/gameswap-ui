import { CircularProgress, makeStyles } from "@material-ui/core";
import { NotFound, PageContainer } from "components";
import { GameDetailsPageContent } from "pages/GameDetailsPage/GameDetailsPageContent";
import { ProfilePageContent } from "pages/ProfilePage/ProfilePageContent";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getAPIService } from "services/api";

const useStyles = makeStyles(() => ({
  root: { height: "auto" },
  loadWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "40vh",
    padding: 24,
  },
}));

interface IState {
  loading: boolean;
  isUser: boolean;
  isGame: boolean;
  customId: string;
  notFound: boolean;
}

const CustomPage = () => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    loading: false,
    isUser: false,
    isGame: false,
    customId: "",
    notFound: false,
  });
  const history = useHistory();
  const customUrl = history.location.pathname.split("?")[0].split("/")[1];

  const apiService = getAPIService();

  useEffect(() => {
    let isMounted = true;

    const loadCustomId = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const info = await apiService.getCustomUrlData(customUrl);
        if (isMounted)
          setState((prev) => ({
            ...prev,
            ...info,
            loading: false,
            notFound: false,
            customId: info.customId.toLowerCase(),
          }));
      } catch (error) {
        if (isMounted)
          setState((prev) => ({
            ...prev,
            loading: false,
            isGame: false,
            isUser: false,
            notFound: true,
          }));
      }
    };

    loadCustomId();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customUrl]);

  return (
    <PageContainer className={classes.root}>
      {state.notFound && <NotFound />}
      {state.loading && (
        <div className={classes.loadWrapper}>
          <CircularProgress size={40} />
        </div>
      )}
      {!state.loading && !state.notFound && state.isGame && (
        <GameDetailsPageContent gameId={state.customId} />
      )}
      {!state.loading && !state.notFound && state.isUser && (
        <ProfilePageContent customUrl={customUrl} userId={state.customId} />
      )}
    </PageContainer>
  );
};

export default CustomPage;
