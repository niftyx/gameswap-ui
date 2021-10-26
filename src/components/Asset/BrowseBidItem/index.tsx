import {
  Button,
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
import clsx from "clsx";
import { BidTag } from "components/Tag";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";
import { IBrowseGameBidItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "1px 12px",
    borderRadius: theme.spacing(1),
    border: `1px solid ${transparentize(0.92, theme.colors.white)}`,
  },
  title: {
    color: theme.colors.white,
    fontSize: theme.spacing(1.6125),
    textTransform: "uppercase",
  },
  img: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: theme.spacing(1),
    borderBottomLeftRadius: theme.spacing(1),
  },
  button: {
    height: theme.spacing(5.5),
    minWidth: "auto",
  },
  comment: {
    color: transparentize(0.4, theme.colors.white),
    fontSize: theme.spacing(1.6125),
    textTransform: "uppercase",
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    "& span": {
      color: theme.colors.white,
      fontSize: theme.spacing(1.6125),
      lineHeight: 1,
    },
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

interface IProps {
  className?: string;
  onClick?: () => void;
}

export const BrowseBidItem = (props: IProps & IBrowseGameBidItem) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget as any);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { image, name, offers, startFromAmount, status } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <Grid alignItems="center" container justify="space-between" spacing={3}>
        <Grid item lg={1} md={3} xs={4}>
          <img alt="img" className={classes.img} src={image} />
        </Grid>
        <Grid item lg={1} md={3} xs={4}>
          <Typography className={classes.title} component="div">
            {name}
          </Typography>
        </Grid>
        <Grid item lg={2} md={3} xs={4}>
          <BidTag tag={status} />
        </Grid>
        <Grid item lg={2} md={3} xs={12}></Grid>
        <Grid item lg={1} md={3} xs={3}>
          <Typography className={classes.comment} component="div">
            Offers&nbsp;&nbsp;&nbsp;<span>{offers}</span>
          </Typography>
        </Grid>
        <Grid item lg={2} md={4} xs={4}>
          <Typography className={classes.comment} component="div">
            Starting From&nbsp;&nbsp;&nbsp;
            <span>{startFromAmount.toNumber()}</span>
          </Typography>
        </Grid>
        <Grid className={commonClasses.textRight} item lg={2} md={3} xs={3}>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
          >
            BID FOR 43.00
          </Button>
        </Grid>
        <Grid className={commonClasses.textRight} item lg={1} md={2} xs={2}>
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
