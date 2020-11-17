import { ThemeProvider } from "@material-ui/styles";
import { LoadingScreen } from "components";
import GlobalStyle from "global-styles";
import { useSettings } from "hooks";
import { MainLayout } from "layouts";
import * as React from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import renderRoutes from "routes";
import { createTheme } from "theme";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import i18n from "./i18n";

function App() {
  const { settings } = useSettings();
  const theme = createTheme(settings);

  return (
    <I18nextProvider i18n={i18n}>
      <React.Suspense fallback={<LoadingScreen />}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <MainLayout>{renderRoutes()}</MainLayout>
            <GlobalStyle />
          </BrowserRouter>
        </ThemeProvider>
      </React.Suspense>
    </I18nextProvider>
  );
}

export default App;
