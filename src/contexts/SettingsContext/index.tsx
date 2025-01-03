import { STORAGE_KEY_SETTINGS } from "config/constants";
import React, { createContext, useEffect, useState } from "react";
import { THEME } from "utils/enums";
import { ISettings } from "utils/types.d";

const defaultSettings: ISettings = {
  theme: THEME.Black,
  responsiveFontSizes: true,
  autoplay: false,
};

export const restoreSettings = () => {
  let settings = null;

  try {
    const storedData = window.localStorage.getItem(STORAGE_KEY_SETTINGS);

    if (storedData) {
      settings = JSON.parse(storedData);
    }
  } catch (err) {
    console.error(err);
  }

  return settings;
};

export const storeSettings = (settings: ISettings) => {
  window.localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
};

const SettingsContext = createContext({
  settings: defaultSettings,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  saveSettings: (_: ISettings) => {},
});

interface IProps {
  settings?: ISettings;
  children: React.ReactNode;
}

export const SettingsProvider = ({ children, settings }: IProps) => {
  const [currentSettings, setCurrentSettings] = useState(
    settings || defaultSettings
  );

  const handleSaveSettings = (update = {}) => {
    const mergedSettings = Object.assign({}, currentSettings, update);

    setCurrentSettings(mergedSettings);
    storeSettings(mergedSettings);
  };

  useEffect(() => {
    const restoredSettings = restoreSettings();

    if (restoredSettings) {
      setCurrentSettings(restoredSettings);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        saveSettings: handleSaveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
