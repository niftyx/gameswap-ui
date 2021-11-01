import { Grid, Slider, Typography, makeStyles } from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import clsx from "clsx";
import { OwnerAvatarRowItem } from "components";
import React from "react";
import Identicon from "react-identicons";
import { shortenAddress } from "utils";
const IdenticonComponent = Identicon as any;

const useStyles = makeStyles((theme) => ({
  root: {},
  attributesWrapper: {
    borderRadius: 4,
    overflow: "hidden",
  },
  attributesTop: {
    backgroundColor: theme.colors.primary85,
    padding: 16,
  },
  attributesBottom: {
    backgroundColor: theme.colors.primary90,
    padding: 16,
  },
  attributeLabel: { fontSize: 13, color: theme.colors.primary60 },
  attributeValue: {
    fontSize: 14,
    color: theme.colors.white,
    marginTop: 4,
    "& span": {
      fontSize: 13,
      color: theme.colors.primary60,
    },
  },
  catWrapper: {
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: theme.colors.primary90,
    borderRadius: 8,
    padding: "24px 0 24px 12px",
  },
  catItem: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    color: theme.colors.white,
    fontSize: 14,
    "& img": {
      marginRight: 16,
      width: 32,
      height: 32,
    },
    "&+&": {
      marginLeft: 16,
    },
  },
  sectionTitle: {
    color: theme.colors.white,
    marginBottom: 16,
  },
  description: {
    color: theme.colors.primary60,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.primary85,
    margin: "16px 0",
    "&.divider-80": { backgroundColor: theme.colors.primary80 },
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    color: theme.colors.primary70,
    fontSize: 14,
    "& span": {
      color: theme.colors.white,
      marginLeft: 16,
    },
    marginBottom: 8,
  },
  linkRow: {
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    color: theme.colors.primary70,
    fontSize: 14,
    "& a": {
      color: theme.colors.blue,
      textDecoration: "none",
      marginLeft: 16,
    },
  },
  royalty: {
    width: 33,
    height: 33,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    color: theme.colors.lime,
    fontSize: 12,
    backgroundColor: theme.colors.primary85,
  },
  slider: {
    marginTop: 6,
    marginBottom: 6,
  },
  sliderRail: { height: 8, background: theme.colors.gradient1, opacity: 1 },
  sliderTrack: {
    height: 8,
    background: theme.colors.transparent,
  },
  sliderThumb: {
    top: 10,
    background:
      "radial-gradient(65.94% 100% at 53.33% 100%, rgba(242, 242, 242, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)",
    width: 8,
    height: 24,
    borderRadius: 2,
    boxShadow: "-2px 0px 12px rgba(0, 0, 0, 0.5)",
  },
}));

interface IProps {
  className?: string;
}

export const MockAssetInfoSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.attributesWrapper}>
        <div className={classes.attributesTop}>
          <div>
            <Typography className={classes.attributeLabel}>
              Wear Value
            </Typography>
            <Slider
              className={classes.slider}
              classes={{
                rail: classes.sliderRail,
                track: classes.sliderTrack,
                thumb: classes.sliderThumb,
              }}
              value={6}
            />
            <Typography className={classes.attributeValue}>6</Typography>
          </div>
          <div className={clsx(classes.divider, "divider-80")} />
          <div>
            <Typography className={classes.attributeLabel}>
              Rarity Score
            </Typography>
            <Typography className={classes.attributeValue}>Normal</Typography>
          </div>
        </div>
        <div className={classes.attributesBottom}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div>
                <Typography className={classes.attributeLabel}>Skin</Typography>
                <Typography className={classes.attributeValue}>
                  Dark <span>(3% have this)</span>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div>
                <Typography className={classes.attributeLabel}>
                  Background
                </Typography>
                <Typography className={classes.attributeValue}>
                  Abstract <span>(65% have this)</span>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div>
                <Typography className={classes.attributeLabel}>Type</Typography>
                <Typography className={classes.attributeValue}>
                  Assault
                </Typography>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div>
                <Typography className={classes.attributeLabel}>
                  Texture
                </Typography>
                <Typography className={classes.attributeValue}>
                  Bubble Gum
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={classes.catWrapper}>
        <Grid container spacing={2}>
          <Grid xs={6}>
            <div className={classes.catItem}>
              <img alt="game" src="/images/mock/inner.png" />
              Inner circle Thing Collection
            </div>
          </Grid>
          <Grid xs={6}>
            <div className={classes.catItem}>
              <img alt="game" src="/images/mock/operation.png" />
              Operation Riptied
            </div>
          </Grid>
        </Grid>
      </div>
      <div>
        <Typography className={classes.sectionTitle}>Description</Typography>
        <Typography className={classes.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget eu
          venenatis egestas facilisi sit aliquet dictum venenatis penatibus.
          Tristique egestas.
        </Typography>
      </div>

      <div className={classes.divider} />
      <div>
        <OwnerAvatarRowItem
          image="/images/mock/owner.png"
          name="the.WATCHER"
          roleName="Owner"
          showTick
        />
        <OwnerAvatarRowItem
          image="/images/mock/artist.png"
          name="Alex CGKOT"
          right={() => <span className={classes.royalty}>10%</span>}
          roleName="Creator"
          showTick
        />
      </div>
      <div className={classes.divider} />
      <div>
        <Typography className={classes.sectionTitle}>Chain details</Typography>
        <Typography className={classes.infoRow}>
          Date: <span>04/04/2021</span>
        </Typography>
        <Typography className={classes.linkRow}>
          Contract Address:{" "}
          <a href="https://" rel="noreferrer" target="_blank">
            0x9b0e...b903
          </a>
        </Typography>
        <Typography className={classes.linkRow}>
          TokenId:{" "}
          <a href="https://" rel="noreferrer" target="_blank">
            1264
          </a>
        </Typography>
        <Typography className={classes.infoRow}>
          Blockchain: <span>Avalanche Fuji</span>
        </Typography>
      </div>
    </div>
  );
};
