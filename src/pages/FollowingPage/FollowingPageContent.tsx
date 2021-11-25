import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import useCommonStyles from "styles/common";

import { HeroSection, TabSection } from "./components";

const useStyles = makeStyles((theme) => ({
  content: {
    height: "100%",
  },
  heroSection: {
    minHeight: "50%",
    marginLeft: -theme.spacing(2),
    marginRight: -theme.spacing(2),
    marginTop: -theme.spacing(2),
  },
  section: {
    marginTop: 8,
    marginBottom: 16,
  },
}));

export const FollowingPageContent = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <div className={clsx(classes.content, commonClasses.scroll)}>
      <HeroSection />
      <TabSection />
    </div>
  );
};
