import {
  Grid,
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
import clsx from "classnames";
import { FarmingTag } from "components/Tag";
import { PLATFORM_ICONS } from "config/constants";
import { transparentize } from "polished";
import React from "react";
import { EFarmingTag } from "utils/enums";
import { IUpcomingFarmItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: theme.spacing(9),
    padding: 1,
    borderRadius: theme.spacing(1),
    border: `1px solid ${transparentize(0.92, theme.colors.text.default)}`,
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.6125),
    textTransform: "uppercase",
  },
  img: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: theme.spacing(1),
    borderBottomLeftRadius: theme.spacing(1),
  },
  tags: {
    "& > * + *": {
      marginLeft: theme.spacing(1.125),
    },
  },
  platforms: {
    "& > * + *": {
      marginLeft: theme.spacing(2.5),
    },
  },
  tokenDescription: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.6125),
    textTransform: "uppercase",
  },
  moreButton: {
    border: "none !important",
    borderRadius: 2,
    height: theme.spacing(3),
    width: theme.spacing(3),
    "& svg": {
      height: theme.spacing(3),
      width: theme.spacing(3),
      color: theme.colors.text.default,
    },
  },
}));

interface IProps {
  className?: string;
  onClick?: () => void;
}

export const UpcomingFarmRow = (props: IProps & IUpcomingFarmItem) => {
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

  const { image, onClick, platforms, tags, title, tokenDescription } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <Grid alignItems="center" container spacing={3}>
        <Grid item xs={2}>
          <img alt="img" className={classes.img} src={image} />
        </Grid>
        <Grid item xs={2}>
          <Typography className={classes.title} component="div">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <div className={classes.tags}>
            {Object.values(EFarmingTag).map((value, index) => (
              <FarmingTag
                active={tags.includes(value as EFarmingTag)}
                key={value}
                tag={value}
              />
            ))}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className={classes.platforms}>
            {platforms.map((platform) => {
              const Icon = PLATFORM_ICONS[platform.toString()];
              return <Icon key={platform} />;
            })}
          </div>
        </Grid>
        <Grid item xs={1}>
          <Typography className={classes.tokenDescription} component="div">
            {tokenDescription}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <>
            <IconButton className={classes.moreButton} onClick={handleClick}>
              <MoreHorizIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              elevation={0}
              getContentAnchorEl={null}
              id={`more-menu-upcoming-farm-row-${props.id}`}
              keepMounted
              onClose={handleClose}
              open={Boolean(anchorEl)}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <MenuItem>
                <ListItemIcon>
                  <SendIcon />
                </ListItemIcon>
                <ListItemText primary={"Test"} />
              </MenuItem>
            </Menu>
          </>
        </Grid>
      </Grid>
    </div>
  );
};
