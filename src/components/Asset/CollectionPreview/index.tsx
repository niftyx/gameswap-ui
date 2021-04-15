import { Avatar, Typography, makeStyles } from "@material-ui/core";
import {
  IconTrendingGameImagePlaceholder,
  IconTrendingGameTitlePlaceholder,
} from "assets/icons";
import clsx from "clsx";
import { transparentize } from "polished";
import React, { useState } from "react";
import Identicon from "react-identicons";
import { NavLink } from "react-router-dom";
import useCommonStyles from "styles/common";
import { formatBigNumber } from "utils";
import { ONE_NUMBER, ZERO_NUMBER } from "utils/number";
import { ICollection } from "utils/types";

const IdenticonComponent = Identicon as any;

const AVATAR_SIZE = 60;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    textDecoration: "none",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    padding: theme.spacing(1),
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2),
  },
  description: {
    color: theme.colors.background.tenth,
    fontSize: theme.spacing(1.5),
    marginBottom: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: theme.colors.background.eleventh,
    borderRadius: 4,
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: theme.colors.background.twelfth,
    },
  },
  top: {
    position: "relative",
    maxHeight: 100,
  },
  topEmpty: { paddingTop: "60%" },
  img: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: transparentize(0.5, theme.colors.background.fourth),
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  imgPlaceholder: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: -AVATAR_SIZE / 2 - 10,
    borderRadius: theme.spacing(1),
    objectFit: "cover",
    width: "100%",
    height: "100%",
    zIndex: 99,
  },
  avatarWrapper: {
    position: "relative",
    top: -AVATAR_SIZE / 2,
  },
  avatar: {
    margin: "auto",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: "50%",
    overflow: "hidden",
  },
  textWrapper: { marginTop: -AVATAR_SIZE / 4, position: "relative" },
  titlePlaceholder: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "50%",
    zIndex: 99,
  },
  point: {
    width: 3,
    height: 3,
    borderRadius: "50%",
    backgroundColor: theme.colors.background.tenth,
  },
  fakeImg: {
    display: "none !important",
  },
}));

interface IProps {
  className?: string;
  onClick?: () => void;
}

interface IState {
  loaded: boolean;
}

export const CollectionPreview = (props: IProps & ICollection) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const [state, setState] = useState<IState>({ loaded: false });

  const totalAvailableAssetsCount = (props.totalSupply || ZERO_NUMBER).sub(
    props.totalBurned || ZERO_NUMBER
  );

  const setLoaded = (loaded: boolean) =>
    setState((prevState) => ({ ...prevState, loaded }));

  const { imageUrl: backgroundImage, name: title } = props;

  const dataVisible = state.loaded;

  return (
    <NavLink
      className={clsx(classes.root, props.className, commonClasses.normalHover)}
      to={`/collections/${props.id}`}
    >
      <div className={classes.content}>
        <div className={classes.top}>
          <div className={classes.topEmpty} />
          {!dataVisible && (
            <div className={classes.imgPlaceholder}>
              <IconTrendingGameImagePlaceholder />
            </div>
          )}

          <div
            className={clsx(
              classes.img,
              commonClasses.fadeAnimation,
              dataVisible ? "visible" : ""
            )}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <img
            alt="fake"
            className={classes.fakeImg}
            onLoad={() => {
              setLoaded(true);
            }}
            src={backgroundImage}
          />
        </div>
        <div className={classes.avatarWrapper}>
          <div className={classes.avatar}>
            <IdenticonComponent
              bg="#fff"
              size={AVATAR_SIZE}
              string={props.owner || ""}
            />
          </div>
        </div>
        <div className={classes.textWrapper}>
          {!dataVisible && (
            <div className={classes.titlePlaceholder}>
              <IconTrendingGameTitlePlaceholder />
            </div>
          )}
          <Typography
            align="center"
            className={clsx(
              classes.title,
              commonClasses.fadeAnimation,
              dataVisible ? "visible" : ""
            )}
            component="div"
          >
            {title}
          </Typography>
          <Typography
            align="center"
            className={clsx(
              classes.description,
              commonClasses.fadeAnimation,
              dataVisible ? "visible" : ""
            )}
            component="div"
          >
            ERC721
            {!totalAvailableAssetsCount.eq(ZERO_NUMBER) && (
              <>
                &nbsp;&nbsp;
                <div className={classes.point} />
                &nbsp;&nbsp;{formatBigNumber(totalAvailableAssetsCount, 0, 0)}
                {totalAvailableAssetsCount.lt(ONE_NUMBER)
                  ? " assets"
                  : " asset"}
              </>
            )}
          </Typography>
        </div>
      </div>
    </NavLink>
  );
};
