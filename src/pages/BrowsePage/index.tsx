import { Hidden, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { BrowseFilter, PageContainer } from "components";
import React from "react";
import { matchPath, useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";

import { AssetItemsSection } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  mainContent: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  assets: {
    flex: 1,
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  },
  inventory: {
    flex: 1,
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  },
  filter: {
    width: theme.spacing(25),
    minWidth: theme.spacing(25),
    margin: `0 ${theme.spacing(2.5)}px`,
  },
}));

const BrowsePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();
  const isFeatured = !!matchPath(history.location.pathname, {
    exact: true,
    path: "/browse/featured",
  });

  return (
    <PageContainer>
      <Hidden mdDown>
        <div className={classes.content}>
          {isFeatured && <div>Featured</div>}
          <div className={classes.mainContent}>
            <BrowseFilter className={classes.filter} />
            <AssetItemsSection
              className={clsx(classes.assets, commonClasses.scroll)}
            />
          </div>
        </div>
      </Hidden>
    </PageContainer>
  );
};

export default BrowsePage;
