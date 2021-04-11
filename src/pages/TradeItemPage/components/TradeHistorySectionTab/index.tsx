import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { HorizonDivider, NoticeGroup } from "components";
import { useGlobal } from "contexts";
import moment from "moment";
import React from "react";
import useCommonStyles from "styles/common";
import { IAssetAttribute, IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  itemDetailsItemRow: {
    alignItems: "flex-start",
    marginTop: theme.spacing(2),
  },
  itemDetailsItemRowTitle: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2),
    fontWeight: "bold",
    marginRight: theme.spacing(2),
  },
  itemDetailsItemRowContent: {
    flex: 1,
    color: theme.colors.text.sixth,
    fontSize: theme.spacing(2),
  },
}));
interface IProps {
  data: IAssetItem;
}
export const TradeHistorySectionTab = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { data } = props;
  const {
    data: { collections },
  } = useGlobal();

  const collection = collections.find((c) => c.id === data.collectionId);

  return (
    <div className={classes.root}>
      <NoticeGroup
        comment="Date"
        title={moment((data.createTimeStamp || 0) * 1000).format("MM/DD/YYYY")}
      />
      {collection && (
        <>
          <HorizonDivider />
          <NoticeGroup comment="GSWAP" title={collection.name || ""} />
        </>
      )}

      {(data.attributes || []).map((attribute: IAssetAttribute, index) => (
        <div
          className={clsx(commonClasses.row, classes.itemDetailsItemRow)}
          key={index}
        >
          <Typography
            className={classes.itemDetailsItemRowTitle}
            component="div"
          >
            {attribute.key}
          </Typography>
          <Typography
            className={classes.itemDetailsItemRowContent}
            component="div"
          >
            {attribute.value}
          </Typography>
        </div>
      ))}
    </div>
  );
};
