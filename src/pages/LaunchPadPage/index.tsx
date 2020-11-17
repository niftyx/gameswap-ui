import { Divider, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageContainer } from "components";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";

import { FeaturedFarms, HeroCarousel, UpcomingFarms } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    height: "100%",
  },
  heroCarousel: {
    minHeight: "50%",
    marginLeft: -theme.spacing(2),
  },
  featuredFarms: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  divider: {
    backgroundColor: transparentize(0.94, theme.colors.text.default),
  },
  upcomingFarms: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const LaunchPadPage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        <HeroCarousel className={classes.heroCarousel} />
        <FeaturedFarms className={classes.featuredFarms} />
        <Divider className={classes.divider} />
        <UpcomingFarms className={classes.upcomingFarms} />
      </div>
    </PageContainer>
  );
};

export default LaunchPadPage;
