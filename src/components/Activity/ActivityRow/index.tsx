import { Button, Grid, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { ActivityTypeTag, TrustPoint } from "components";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";
import { shortenAddress } from "utils";
import { IActivityItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid ${transparentize(0.92, theme.colors.text.default)}`,
    padding: theme.spacing(2.5),
    minHeight: theme.spacing(12.5),
  },
  img: {
    width: "100%",
    height: "100%",
    maxHeight: theme.spacing(4.5),
  },
  title: {
    fontSize: theme.spacing(1.6125),
    color: theme.colors.text.default,
  },
  address: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
  },
  button: {
    height: theme.spacing(5.5),
    minWidth: "auto",
  },
}));

interface IProps extends IActivityItem {
  onClickViewTx?: () => void;
  className?: string;
}

export const ActivityRow = (props: IProps) => {
  const {
    address,
    image,
    onClickViewTx,
    title,
    trustPoints,
    txHash,
    type,
  } = props;
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <Grid alignItems="center" container spacing={3}>
        <Grid item lg={2} xs={4}>
          <img alt="img" className={classes.img} src={image} />
        </Grid>
        <Grid item lg={3} xs={4}>
          <Typography className={classes.title} component="div">
            {title}
          </Typography>
        </Grid>
        <Grid item lg={1} xs={4}>
          <ActivityTypeTag type={type} />
        </Grid>
        <Grid item lg={2} xs={4}>
          <Typography
            className={clsx(classes.address, commonClasses.textAlignRight)}
            component="div"
          >
            {shortenAddress(address)}
          </Typography>
        </Grid>
        <Grid item lg={2} xs={4}>
          <TrustPoint point={trustPoints} />
        </Grid>
        <Grid className={commonClasses.textAlignRight} item lg={2} xs={4}>
          <Button
            className={clsx(commonClasses.transparentButton, classes.button)}
            onClick={onClickViewTx}
            variant="contained"
          >
            VIEW TX
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
