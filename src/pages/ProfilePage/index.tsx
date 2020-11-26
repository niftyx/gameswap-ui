import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageContainer } from "components";
import React from "react";
import useCommonStyles from "styles/common";

import {
  HeroSection,
  LatestActivitySection,
  NoticeSection,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "auto",
  },
  content: {
    height: "100%",
  },
  heroSection: {
    minHeight: "50%",
    marginLeft: -theme.spacing(2),
  },
  noticeSection: {
    marginTop: -theme.spacing(5),
    padding: theme.spacing(2),
  },
  latestActivitySection: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
  },
}));

const ProfilePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        <HeroSection className={classes.heroSection} />
        <NoticeSection className={classes.noticeSection} />
        <LatestActivitySection className={classes.latestActivitySection} />
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
