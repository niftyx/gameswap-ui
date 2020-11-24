import { Grid, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageContainer } from "components";
import React from "react";
import useCommonStyles from "styles/common";

import { ChartSection, InfoSection, ItemViewSection } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    height: "100%",
  },
  infoSection: {
    minHeight: "50%",
  },
  chartSection: {
    padding: theme.spacing(2),
  },
}));

const TradeItemPage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        <Grid container spacing={3}>
          <Grid item md={7} xs={12}>
            <ItemViewSection img={"/svgs/mock/1.svg"} />
            <ChartSection className={classes.chartSection} />
          </Grid>
          <Grid item md={5} xs={12}>
            <InfoSection className={classes.infoSection} />
          </Grid>
        </Grid>
      </div>
    </PageContainer>
  );
};

export default TradeItemPage;
