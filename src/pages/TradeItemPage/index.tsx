import { Grid, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageContainer, SimpleLoader } from "components";
import { useAssetDetailsWithOrderFromId, useAssetHistoryFromId } from "helpers";
import React from "react";
import { Redirect, useParams } from "react-router-dom";
import useCommonStyles from "styles/common";

import {
  ChainInfoSection,
  HistorySection,
  InfoSection,
  ItemViewSection,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    paddingTop: theme.spacing(3),
    height: "100%",
  },
  infoSection: {
    minHeight: "50%",
  },
  chartSection: {
    padding: theme.spacing(2),
  },
  left: {
    borderRight: `1px solid ${theme.colors.border.secondary}`,
  },
  navToolbar: {
    marginBottom: theme.spacing(3),
  },
}));

const TradeItemPage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const params = useParams();
  const assetId = ((params || {}) as any).id as string;
  const { data: assetData } = useAssetDetailsWithOrderFromId(assetId || "");
  const historyData = useAssetHistoryFromId(assetId || "");

  if (!assetId || !assetId.startsWith("0x")) {
    return <Redirect to="/trade" />;
  }

  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        {/* <NavToolbar
          className={classes.navToolbar}
          items={[
            { title: "All games", href: "/all-games" },
            { title: "Cyber Assault", href: "/all-games/cyber-assault" },
            { title: "Stealth Fighter KN-30", href: "/trade/test" },
          ]}
        /> */}
        {(!assetData || !assetData.image) && <SimpleLoader />}
        {assetData && assetData.image && (
          <Grid container spacing={3}>
            <Grid item md={7} xs={12}>
              <div className={classes.left}>
                <ItemViewSection data={assetData} />
                <HistorySection
                  className={classes.chartSection}
                  tradeHistoryData={historyData}
                />
              </div>
            </Grid>
            <Grid item md={5} xs={12}>
              <InfoSection className={classes.infoSection} data={assetData} />
              <ChainInfoSection data={assetData} />
            </Grid>
          </Grid>
        )}
      </div>
    </PageContainer>
  );
};

export default TradeItemPage;
