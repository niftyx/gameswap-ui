import { makeStyles } from "@material-ui/core";
import { ReactComponent as CartIcon } from "assets/svgs/cart-arrow-up.svg";
import clsx from "clsx";
import { SyncButton } from "components/Button";
import { VerticalDivider } from "components/Divider";
import { CollectionSelect, GamesSelect } from "components/Select";
import { useGlobal } from "contexts";
import React from "react";
import { IInventoryFilter } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.custom.pageToolbarHeight,
    padding: `${theme.spacing(1)}px`,
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(2.5),
    },
  },
  balance: {
    flex: 1,
    color: theme.colors.white,
  },
  cart: {
    cursor: "pointer",
    color: theme.colors.white,
  },
}));

interface IProps {
  className?: string;
  onReload: () => Promise<void>;
  filter: IInventoryFilter;
  onUpdateFilter: (_: IInventoryFilter) => void;
  loading: boolean;
}

const InventoryToolbar = (props: IProps) => {
  const classes = useStyles();
  const {
    data: { collections, games },
  } = useGlobal();
  const { filter, onReload, onUpdateFilter } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <SyncButton isSyncing={props.loading} onSync={onReload} />
      <VerticalDivider />
      <GamesSelect
        games={games}
        onUpdate={(gameId?: string) => {
          onUpdateFilter({ ...filter, gameId });
        }}
        selectedGameId={filter.gameId}
      />
      <CollectionSelect
        collections={collections}
        onUpdate={(collectionId?: string) => {
          onUpdateFilter({ ...filter, collectionId });
        }}
        selectedCollectionId={filter.collectionId}
      />
      {/* <PriceSelect /> */}
      {/* <Hidden lgDown>
        <SearchInput />
      </Hidden> */}

      {/* <Typography align="right" className={classes.balance} component="div">
        $ {numberWithCommas("2.00")}
      </Typography>
      <CartIcon className={classes.cart} /> */}
    </div>
  );
};

export default InventoryToolbar;
