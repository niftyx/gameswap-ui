import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { ReactComponent as AppsIcon } from "assets/svgs/apps.svg";
import clsx from "classnames";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  moreButton: {
    borderRadius: theme.spacing(1),
    height: theme.custom.appHeaderItemHeight,
    width: theme.custom.appHeaderItemHeight,
    border: "none !important",
    "& svg": {
      height: Number(theme.custom.appHeaderItemHeight) / 2,
      width: Number(theme.custom.appHeaderItemHeight) / 2,
      color: theme.colors.text.default,
    },
  },
}));

interface IProps {
  className?: string;
}

const LaunchPad = (props: IProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget as any);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <Button
        className={classes.moreButton}
        onClick={handleClick}
        variant="outlined"
      >
        <AppsIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        elevation={0}
        getContentAnchorEl={null}
        id="notifications-menu"
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="Test" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LaunchPad;
