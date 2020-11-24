import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { BrowseBidItem } from "components";
import { MOCK_AUCTIONS_ITEMS } from "config/constants";
import React, { useState } from "react";
import { IBrowseGameBidItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: theme.spacing(0.5),
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

interface IProps {
  className?: string;
}

interface IState {
  assets: IBrowseGameBidItem[];
}

const AuctionItemsSection = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    assets: MOCK_AUCTIONS_ITEMS,
  });

  return (
    <div className={clsx(classes.root, props.className)}>
      {state.assets.map((item: IBrowseGameBidItem) => (
        <BrowseBidItem key={item.id} {...item} />
      ))}
    </div>
  );
};

export default AuctionItemsSection;
