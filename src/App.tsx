import { ThemeProvider } from "@material-ui/styles";
import { LoadingScreen } from "components";
import { ConnectedWeb3 } from "contexts";
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
import connectors from "utils/connectors";
import Web3Provider from "web3-react";

import i18n from "./i18n";

function App() {
  const { settings } = useSettings();
  const theme = createTheme(settings);

  return (
    <I18nextProvider i18n={i18n}>
      <React.Suspense fallback={<LoadingScreen />}>
        <ThemeProvider theme={theme}>
          <Web3Provider connectors={connectors} libraryName="ethers.js">
            <ConnectedWeb3>
              <BrowserRouter>
                <MainLayout>{renderRoutes()}</MainLayout>
                <GlobalStyle />
              </BrowserRouter>
            </ConnectedWeb3>
          </Web3Provider>
        </ThemeProvider>
      </React.Suspense>
    </I18nextProvider>
  );
}

export default App;
