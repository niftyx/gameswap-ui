import { makeStyles } from "@material-ui/core";
import { PageContainer, SimpleLoader } from "components";
import { useAssetDetailsWithOrderFromId } from "helpers";
import React from "react";
import { Redirect, useParams } from "react-router-dom";

import { InfoContainer, ItemViewSection } from "./components";

const useStyles = makeStyles((theme) => ({
  root: { padding: 0 },
  content: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  leftContent: {
    borderRight: `1px solid ${theme.colors.white}`,
    flex: 1,
    height: "100%",
    padding: 16,
    display: "flex",
    alignItems: "center",
  },
  rightContent: {
    maxWidth: 500,
    height: "100%",
    width: "35%",
    overflowY: "auto",
  },
  infoSection: {
    minHeight: "50%",
  },
  navToolbar: {
    marginBottom: theme.spacing(3),
  },
}));

const TradeItemPage = () => {
  const classes = useStyles();
  const params = useParams();
  const assetId = (((params || {}) as any).id as string).toLowerCase();
  const { data: assetData } = useAssetDetailsWithOrderFromId(assetId || "");

  if (!assetId || !assetId.startsWith("0x")) {
    return <Redirect to="/trade" />;
  }

  return (
    <PageContainer className={classes.root}>
      <div className={classes.content}>
        {(!assetData || !assetData.image) && <SimpleLoader />}
        {assetData && assetData.image && (
          <>
            <div className={classes.leftContent}>
              <ItemViewSection data={assetData} />
            </div>
            <div className={classes.rightContent}>
              <InfoContainer className={classes.infoSection} data={assetData} />
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default TradeItemPage;
