import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import SendIcon from "@material-ui/icons/Send";
import clsx from "clsx";
import React from "react";
import { ISideMenuGroupHeaderItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(7)}px ${theme.spacing(0.5)}px ${theme.spacing(
      3
    )}px`,
    padding: `${theme.spacing(0.125)}px ${theme.spacing(0.5)}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: theme.colors.white,
  },
  icon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  title: {
    fontSize: "10px",
  },
  moreButton: {
    border: "none !important",
    borderRadius: 6,
    height: theme.spacing(3),
    width: theme.spacing(3),
    "& svg": {
      height: theme.spacing(3),
      width: theme.spacing(3),
      color: theme.colors.white,
    },
  },
}));

export const SideMenuGroupHeader = (props: ISideMenuGroupHeaderItem) => {
  const { moreItems = [], title } = props;
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
      <Typography className={classes.title} component="div">
        {title}
      </Typography>
      {moreItems.length > 0 && (
        <>
          <IconButton className={classes.moreButton} onClick={handleClick}>
            <MoreHorizIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            elevation={0}
            getContentAnchorEl={null}
            id={`more-menu-side-menu-group-header-${title}`}
            keepMounted
            onClose={handleClose}
            open={Boolean(anchorEl)}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            {moreItems.map((item) => (
              <MenuItem key={item.title} onClick={item.onClick}>
                <ListItemIcon>
                  <SendIcon />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </div>
  );
};
