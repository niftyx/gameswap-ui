import { Grid, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { NavToolbar, PageContainer } from "components";
import React from "react";
import useCommonStyles from "styles/common";

import { ChartSection, InfoSection, ItemViewSection } from "./components";

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

  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        <NavToolbar
          className={classes.navToolbar}
          items={[
            { title: "All games", href: "/all-games" },
            { title: "Cyber Assault", href: "/all-games/cyber-assault" },
            { title: "Stealth Fighter KN-30", href: "/trade/test" },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item md={7} xs={12}>
            <div className={classes.left}>
              <ItemViewSection img={"/svgs/mock/1.svg"} />
              <ChartSection className={classes.chartSection} />
            </div>
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
