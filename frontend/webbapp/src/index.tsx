// index.tsx

import { ThemeProvider } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { TranslationMessages } from "../types";
import {
  LanguageProvider,
  useLanguageContext,
} from "./contexts/languageContext";
import Navigation from "./navigation";
import store from "./slices/store";
import { theme1 } from "./theme";
import messages_en from "./translations/en.json";
import messages_sv from "./translations/sv.json";

const LanguageConsumer = () => {
  const { language } = useLanguageContext();

  return (
    <IntlProvider locale={language} messages={messages[language]}>
      <Navigation />
    </IntlProvider>
  );
};

const messages: TranslationMessages = {
  sv: messages_sv,
  en: messages_en,
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme1}>
        <BrowserRouter>
          <LanguageProvider>
            <LanguageConsumer />
          </LanguageProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
