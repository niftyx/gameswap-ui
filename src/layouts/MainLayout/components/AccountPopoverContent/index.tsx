import { makeStyles } from "@material-ui/core";
import { AccountPopoverItem } from "components";
import { STORAGE_KEY_CONNECTOR } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { useSettings } from "hooks";
import React from "react";
import { useHistory } from "react-router-dom";
import { THEME } from "utils/types.d";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "16px 12px",
    minWidth: 300,
  },
}));

interface IProps {
  onClose: () => void;
}

export const AccountPopoverContent = (props: IProps) => {
  const classes = useStyles();
  const { rawWeb3Context } = useConnectedWeb3Context();
  const { saveSettings, settings } = useSettings();
  const history = useHistory();
  const { onClose } = props;

  const onDisconnect = () => {
    onClose();
    rawWeb3Context.deactivate();
    localStorage.removeItem(STORAGE_KEY_CONNECTOR);
  };

  const onMyItems = () => {
    history.push("/profile/assets");
    onClose();
  };

  const onEditProfile = () => {
    history.push("/settings");
    onClose();
  };

  return (
    <div className={classes.root}>
      <AccountPopoverItem onClick={onMyItems} title="My items" />
      <AccountPopoverItem onClick={onEditProfile} title="Edit profile" />
      <AccountPopoverItem
        onClick={() => {
          saveSettings({
            ...settings,
            autoplay: settings.autoplay ? false : true,
          });
        }}
        showToggle
        title="GIF/Video autoplay"
        toggleValue={settings.autoplay}
      />
      <AccountPopoverItem
        onClick={() => {
          saveSettings({
            ...settings,
            theme: settings.theme === THEME.Black ? THEME.White : THEME.Black,
          });
        }}
        showToggle
        title={settings.theme === THEME.Black ? "Dark theme" : "Whit theme"}
        toggleValue={settings.theme === THEME.Black}
      />
      <AccountPopoverItem onClick={onDisconnect} title="Disconnect" />
    </div>
  );
};
