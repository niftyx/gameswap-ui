import {
  Button,
  ButtonGroup,
  Divider,
  MenuItem,
  Select,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { MOCK_PRICE_FILTER_ITEMS } from "config/constants";
import { transparentize } from "polished";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { EOrderStatus, EPlatform } from "utils/enums";
import { KnownToken } from "utils/types";

import { CollectionFilter } from "../CollectionFilter";
import FilterItemWrapper from "../FilterItemWrapper";
import { OrderStatusFilter } from "../OrderStatusFilter";
import { PlatformFilter } from "../PlatformFilter";
import PriceFilter from "../PriceFilter";
import { SaleCurrencyFilter } from "../SaleCurrencyFilter";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(1)}px ${theme.spacing(0.5)}px`,
    overflowY: "auto",
  },
  buy: {
    borderRadius: 6,
    backgroundColor: theme.colors.background.fourth,
    height: theme.spacing(5),
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(4),
  },
  divider: {
    height: 3,
    backgroundColor: theme.colors.border.fifth,
    marginTop: theme.spacing(2),
  },
  reset: {
    marginTop: 16,
    height: theme.spacing(4.5),
    minWidth: "auto",
    fontSize: 14,
    color: transparentize(0.3, theme.colors.text.default),
  },
  mode: { backgroundColor: theme.colors.background.primary, marginBottom: 24 },
  modeSelect: {
    paddingLeft: 8,
  },
  membershipWrapper: {
    height: theme.spacing(5),
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
    backgroundColor: theme.colors.background.primary,
    marginBottom: 16,
  },
  membershipButton: {
    backgroundColor: theme.colors.background.primary,
    borderRight: "none !important",
    "&.active": {
      backgroundColor: theme.colors.background.fourth,
      borderRadius: "6px !important",
    },
  },
}));

interface IProps {
  className?: string;
}

enum EMembership {
  Basic = "Basic",
  Pro = "Pro",
}

interface IState {
  filter: {
    priceEnabled: boolean;
    priceMin?: number;
    priceMax?: number;
    statusEnabled: boolean;
    statuses?: EOrderStatus[];
    collectionEnabled: boolean;
    collectionIds?: string[];
    saleCurrencyEnabled: boolean;
    currencies?: KnownToken[];
    membership: EMembership;
    platformEnabled: boolean;
    platforms?: EPlatform[];
  };
}

const TradeFilter = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = useState<IState>({
    filter: {
      priceEnabled: false,
      statusEnabled: false,
      collectionEnabled: false,
      saleCurrencyEnabled: false,
      platformEnabled: false,
      membership: EMembership.Basic,
    },
  });

  const updateFilter = (newValues: any) =>
    setState((prevState) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        ...newValues,
      },
    }));

  return (
    <div className={clsx(classes.root, props.className, commonClasses.scroll)}>
      <Button
        className={classes.buy}
        color="primary"
        fullWidth
        variant="contained"
      >
        TRADE
      </Button>
      <Select
        className={classes.mode}
        classes={{
          select: classes.modeSelect,
        }}
        defaultValue="nft-nft"
        disableUnderline
        fullWidth
      >
        <MenuItem value="nft-nft">NFT - NFT</MenuItem>
        <MenuItem value="nft-erc20">NFT - ERC20</MenuItem>
      </Select>
      <ButtonGroup
        className={classes.membershipWrapper}
        color="primary"
        disableElevation
        fullWidth
        variant="contained"
      >
        <Button
          className={clsx(
            classes.membershipButton,
            state.filter.membership === EMembership.Basic ? "active" : ""
          )}
          color="primary"
          onClick={() =>
            updateFilter({
              membership: EMembership.Basic,
            })
          }
        >
          Basic
        </Button>
        <Button
          className={clsx(
            classes.membershipButton,
            state.filter.membership === EMembership.Pro ? "active" : ""
          )}
          color="primary"
          onClick={() =>
            updateFilter({
              membership: EMembership.Pro,
            })
          }
        >
          Pro
        </Button>
      </ButtonGroup>
      <FilterItemWrapper
        enabled={state.filter.priceEnabled}
        onToggle={() => {
          updateFilter({ priceEnabled: !state.filter.priceEnabled });
        }}
        title="Price"
      >
        <PriceFilter
          items={MOCK_PRICE_FILTER_ITEMS}
          max={state.filter.priceMax}
          min={state.filter.priceMin}
          onChange={({ max, min }: { min?: number; max?: number }) => {
            setState((prevState) => ({
              ...prevState,
              filter: { ...prevState.filter, priceMin: min, priceMax: max },
            }));
          }}
        />
        <Divider className={classes.divider} />
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.platformEnabled}
        onToggle={() => {
          updateFilter({ platformEnabled: !state.filter.platformEnabled });
        }}
        title="Platform"
      >
        <PlatformFilter
          onChange={(platforms: EPlatform[]) => {
            setState((prevState) => ({
              ...prevState,
              filter: { ...prevState.filter, platforms },
            }));
          }}
          platforms={state.filter.platforms || []}
        />
        <Divider className={classes.divider} />
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.statusEnabled}
        onToggle={() => {
          updateFilter({ statusEnabled: !state.filter.statusEnabled });
        }}
        title="Status"
      >
        <OrderStatusFilter
          onChange={(statuses) => {
            setState((prev) => ({
              ...prev,
              filter: { ...prev.filter, statuses },
            }));
          }}
          statuses={state.filter.statuses || []}
        />
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.collectionEnabled}
        onToggle={() => {
          updateFilter({ collectionEnabled: !state.filter.collectionEnabled });
        }}
        title="Collection"
      >
        <CollectionFilter
          collectionIds={state.filter.collectionIds || []}
          onChange={(collectionIds) => {
            setState((prev) => ({
              ...prev,
              filter: { ...prev.filter, collectionIds },
            }));
          }}
        />
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.saleCurrencyEnabled}
        onToggle={() => {
          updateFilter({
            saleCurrencyEnabled: !state.filter.saleCurrencyEnabled,
          });
        }}
        title="Sale Currency"
      >
        <SaleCurrencyFilter
          currencies={state.filter.currencies || []}
          onChange={(currencies) => {
            setState((prev) => ({
              ...prev,
              filter: { ...prev.filter, currencies },
            }));
          }}
        />
      </FilterItemWrapper>
      <Button
        className={clsx(commonClasses.transparentButton, classes.reset)}
        color="secondary"
        fullWidth
        onClick={() => {
          setState({
            filter: {
              priceEnabled: false,
              statusEnabled: false,
              collectionEnabled: false,
              saleCurrencyEnabled: false,
              platformEnabled: false,
              membership: EMembership.Basic,
            },
          });
        }}
        variant="contained"
      >
        RESET FILTERS
      </Button>
    </div>
  );
};

export default TradeFilter;
