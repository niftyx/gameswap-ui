import { Web3Provider } from "@ethersproject/providers";
import { ThemeProvider } from "@material-ui/styles";
import { Web3ReactProvider } from "@web3-react/core";
import { LoadingScreen } from "components";
import { ConnectedWeb3, GlobalProvider, IpfsProvider } from "contexts";
import GlobalStyle from "global-styles";
import { useSettings } from "hooks";
import { MainLayout } from "layouts";
import * as React from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import renderRoutes from "routes";
import { createTheme } from "theme";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import i18n from "./i18n";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const { settings } = useSettings();
  const theme = createTheme(settings);

  return (
    <I18nextProvider i18n={i18n}>
      <React.Suspense fallback={<LoadingScreen />}>
        <GlobalProvider>
          <ThemeProvider theme={theme}>
            <Web3ReactProvider getLibrary={getLibrary}>
              <ConnectedWeb3>
                <IpfsProvider>
                  <BrowserRouter>
                    <MainLayout>{renderRoutes()}</MainLayout>
                    <GlobalStyle />
                  </BrowserRouter>
                </IpfsProvider>
              </ConnectedWeb3>
            </Web3ReactProvider>
          </ThemeProvider>
        </GlobalProvider>
      </React.Suspense>
    </I18nextProvider>
  );
}

export default App;
