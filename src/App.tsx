import { Web3Provider } from "@ethersproject/providers";
import { ThemeProvider } from "@material-ui/styles";
import { Web3ReactProvider } from "@web3-react/core";
import { LoadingScreen } from "components";
import { ConnectedWeb3, GlobalProvider, TradeProvider } from "contexts";
import { useSettings } from "hooks";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import routes, { renderRoutes } from "routes";
import { createTheme } from "theme";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "packages/slick-carousel/slick/slick.css";
import "packages/slick-carousel/slick/slick-theme.css";

import "./App.scss";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const { settings } = useSettings();
  const theme = createTheme(settings);

  return (
    <React.Suspense fallback={<LoadingScreen />}>
      <GlobalProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            autoHideDuration={3000}
            maxSnack={3}
          >
            <Web3ReactProvider getLibrary={getLibrary}>
              <ConnectedWeb3>
                <BrowserRouter>
                  <TradeProvider>{renderRoutes(routes)}</TradeProvider>
                </BrowserRouter>
              </ConnectedWeb3>
            </Web3ReactProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </GlobalProvider>
    </React.Suspense>
  );
}

export default App;
