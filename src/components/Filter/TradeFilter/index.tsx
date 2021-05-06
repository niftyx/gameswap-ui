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
import { EMembership, EOrderStatus, EPlatform } from "utils/enums";
import { ITradeFilter, KnownToken } from "utils/types";

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
  filter: ITradeFilter;
  updateFilter: (_: any) => void;
}

const TradeFilter = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { filter, updateFilter } = props;

  const onChangePrice = ({ max, min }: { min?: number; max?: number }) => {
    updateFilter({ priceMin: min, priceMax: max });
  };

  const onChangePlatform = (platforms: EPlatform[]) => {
    updateFilter({ platforms });
  };

  const onChangeStatus = (statuses: EOrderStatus[]) => {
    updateFilter({ statuses });
  };

  const onChangeCollection = (collectionIds: string[]) => {
    updateFilter({ collectionIds });
  };

  const onChangeCurrencies = (currencies: KnownToken[]) => {
    updateFilter({ currencies });
  };

  const onReset = () => {
    updateFilter({
      priceEnabled: false,
      statusEnabled: false,
      collectionEnabled: false,
      saleCurrencyEnabled: false,
      platformEnabled: false,
      membership: EMembership.Basic,
    });
  };

  const onToggleFilter = (key: keyof ITradeFilter) => () => {
    updateFilter({
      [key]: !filter[key],
    });
  };

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
            filter.membership === EMembership.Basic ? "active" : ""
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
            filter.membership === EMembership.Pro ? "active" : ""
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
      {/* <FilterItemWrapper
        enabled={state.filter.priceEnabled}
        onToggle={onToggleFilter("priceEnabled")}
        title="Price"
      >
        <PriceFilter
          items={MOCK_PRICE_FILTER_ITEMS}
          max={state.filter.priceMax}
          min={state.filter.priceMin}
          onChange={onChangePrice}
        />
        <Divider className={classes.divider} />
      </FilterItemWrapper> */}
      {/* <FilterItemWrapper
        enabled={state.filter.platformEnabled}
        onToggle={onToggleFilter("platformEnabled")}
        title="Platform"
      >
        <PlatformFilter
          onChange={onChangePlatform}
          platforms={state.filter.platforms || []}
        />
        <Divider className={classes.divider} />
      </FilterItemWrapper> */}
      {/* <FilterItemWrapper
        enabled={state.filter.statusEnabled}
        onToggle={onToggleFilter("statusEnabled")}
        title="Status"
      >
        <OrderStatusFilter
          onChange={onChangeStatus}
          statuses={state.filter.statuses || []}
        />
      </FilterItemWrapper> */}
      {/* <FilterItemWrapper
        enabled={state.filter.collectionEnabled}
        onToggle={onToggleFilter("collectionEnabled")}
        title="Collection"
      >
        <CollectionFilter
          collectionIds={state.filter.collectionIds || []}
          onChange={onChangeCollection}
        />
      </FilterItemWrapper> */}
      <FilterItemWrapper
        enabled={filter.saleCurrencyEnabled}
        onToggle={onToggleFilter("saleCurrencyEnabled")}
        title="Sale Currency"
      >
        <SaleCurrencyFilter
          currencies={filter.currencies || []}
          onChange={onChangeCurrencies}
        />
      </FilterItemWrapper>
      <Button
        className={clsx(commonClasses.transparentButton, classes.reset)}
        color="secondary"
        fullWidth
        onClick={onReset}
        variant="contained"
      >
        RESET FILTERS
      </Button>
    </div>
  );
};

export default TradeFilter;
