import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageContainer } from "components";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { EProfileTab } from "utils/enums";

import {
  AssetsSection,
  AssetsTabSection,
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
    marginRight: -theme.spacing(2),
    marginTop: -theme.spacing(2),
  },
  // noticeSection: {
  //   marginTop: -theme.spacing(5),
  //   padding: theme.spacing(2),
  // },
  // latestActivitySection: {
  //   marginTop: theme.spacing(5),
  //   marginBottom: theme.spacing(2),
  // },
  section: {
    marginTop: 8,
  },
}));

interface IState {
  tab: EProfileTab;
}

const ProfilePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const [state, setState] = useState<IState>({
    tab: EProfileTab.Assets,
  });

  const setTab = (tab: EProfileTab) => setState((prev) => ({ ...prev, tab }));

  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        <HeroSection className={classes.heroSection} />
        <AssetsTabSection
          className={classes.section}
          onChange={setTab}
          tab={state.tab}
        />
        <AssetsSection className={classes.section} tab={state.tab} />
        {/* <NoticeSection className={classes.noticeSection} />
        <LatestActivitySection className={classes.latestActivitySection} /> */}
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
