import {
  Button,
  CircularProgress,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "classnames";
import { FeaturedFarmPreview } from "components";
import { MockFeaturedFarms } from "config/constants";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { waitSeconds } from "utils";
import { IFeaturedFarmItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.text.default,
    fontSize: 13,
  },
  content: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  loaderWrapper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
  loader: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    margin: "auto",
  },
  viewMore: {
    height: theme.spacing(5.5),
    minWidth: "auto",
  },
}));

interface IProps {
  className?: string;
}

interface IState {
  loading: boolean;
  featuredFarms: IFeaturedFarmItem[];
}

export const FeaturedFarms = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const [state, setState] = useState<IState>({
    loading: false,
    featuredFarms: MockFeaturedFarms,
  });

  const setLoading = (loading: boolean) =>
    setState((prevState) => ({ ...prevState, loading }));

  const loadMore = () => {
    setLoading(true);
    waitSeconds().then(() => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        featuredFarms: [
          ...prevState.featuredFarms,
          ...MockFeaturedFarms.map((element) => ({
            ...element,
            id: `${element.id}-${Date.now()}`,
          })),
        ],
      }));
    });
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        <Typography className={classes.title} component="div">
          OTHER FEATURED FARMS
        </Typography>
        <Button
          className={clsx(commonClasses.transparentButton, classes.viewMore)}
          disabled={state.loading}
          onClick={loadMore}
          variant="contained"
        >
          VIEW MORE
        </Button>
      </div>
      <div className={classes.content}>
        <Grid container spacing={3}>
          {state.featuredFarms.map((item: IFeaturedFarmItem) => (
            <Grid item key={item.id} lg={4} md={6} sm={6} xl={3} xs={6}>
              <FeaturedFarmPreview {...item} />
            </Grid>
          ))}
        </Grid>
        {state.loading && (
          <div className={classes.loaderWrapper}>
            <CircularProgress
              className={classes.loader}
              color="primary"
              size="large"
            />
          </div>
        )}
      </div>
    </div>
  );
};
