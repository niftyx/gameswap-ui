import { CircularProgress, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { OwnerAvatarRowItem } from "components";
import moment from "moment";
import React from "react";
import { EHistoryItemType } from "utils/enums";
import { IHistoryItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  hashA: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: theme.colors.text.default,
    "& > * + *": {
      marginLeft: 8,
    },
  },
  ownerItem: {
    borderBottom: `1px solid ${theme.colors.border.secondary}`,
  },
}));

interface IProps {
  className?: string;
  tradeHistoryData: {
    history: IHistoryItem[];
    loading: boolean;
  };
}

export const Owners = (props: IProps) => {
  const classes = useStyles();
  const {
    tradeHistoryData: { history: historyItems, loading },
  } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      {loading ? (
        <CircularProgress color="primary" size={40} />
      ) : (
        historyItems.map((item) => {
          let roleStr = "";
          switch (item.type) {
            case EHistoryItemType.Created:
              roleStr = `Created ${moment(item.timestamp * 1000).fromNow()}`;
              break;
            case EHistoryItemType.Transfer:
              roleStr = `Transferred ${moment(
                item.timestamp * 1000
              ).fromNow()}`;
              break;
            case EHistoryItemType.Sale:
              roleStr = `Bought ${moment(item.timestamp * 1000).fromNow()}`;
              break;
            default:
              break;
          }
          return (
            <OwnerAvatarRowItem
              address={item.to}
              className={classes.ownerItem}
              href={item.to ? `/users/${item.to}` : undefined}
              key={item.timestamp}
              roleName={roleStr}
            />
          );
        })
      )}
    </div>
  );
};
