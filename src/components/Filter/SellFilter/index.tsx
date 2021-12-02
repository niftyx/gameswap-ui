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
  root: {},
  buy: {
    opacity: 0.4,
    borderRadius: 6,
    backgroundColor: theme.colors.purple60,
    height: theme.spacing(5),
    fontSize: theme.spacing(2),
    color: theme.colors.white,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(4),
  },
  divider: {
    height: 3,
    backgroundColor: theme.colors.white,
    marginTop: theme.spacing(2),
  },
  reset: {
    marginTop: 16,
    height: theme.spacing(4.5),
    minWidth: "auto",
    fontSize: 14,
    color: transparentize(0.3, theme.colors.white),
  },
  mode: {
    backgroundColor: theme.colors.primary80,
    marginBottom: 24,
    height: 40,
    borderRadius: 4,
  },
  modeSelect: {
    paddingLeft: 8,
  },
  membershipWrapper: {
    height: theme.spacing(5),
    fontSize: theme.spacing(2),
    color: theme.colors.white,
    backgroundColor: theme.colors.primary100,
    marginBottom: 16,
  },
  membershipButton: {
    backgroundColor: theme.colors.primary100,
    borderRight: "none !important",
    "&.active": {
      backgroundColor: theme.colors.primary60,
      borderRadius: "6px !important",
    },
  },
  collectionWrapper: {
    border: `1px solid ${theme.colors.primary80}`,
    borderRadius: 100,
    height: 40,
    display: "flex",
    alignItems: "center",
    padding: 8,
    color: theme.colors.white,
    fontSize: 14,
    "& img": {
      width: 24,
      height: 24,
      borderRadius: "50%",
      marginRight: 8,
    },
  },
}));

interface IProps {
  className?: string;
  filter: ITradeFilter;
  updateFilter: (_: any) => void;
}

export const SellFilter = (props: IProps) => {
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
      platforms: [],
      currencies: [],
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
        SELL
      </Button>
      {/* <Select
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
      </Select> */}
      <div className={classes.collectionWrapper}>
        <img alt="img" src="/images/mock/artist.png" />
        Cyberpunk 2077
      </div>
      {/* <ButtonGroup
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
      </ButtonGroup> */}
      <FilterItemWrapper
        enabled={filter.priceEnabled}
        onToggle={onToggleFilter("priceEnabled")}
        title="Price"
      >
        <PriceFilter
          items={MOCK_PRICE_FILTER_ITEMS}
          max={filter.priceMax}
          min={filter.priceMin}
          onChange={onChangePrice}
        />
        <Divider className={classes.divider} />
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={filter.platformEnabled}
        onToggle={onToggleFilter("platformEnabled")}
        title="Platform"
      >
        <PlatformFilter
          onChange={onChangePlatform}
          platforms={filter.platforms || []}
        />
        <Divider className={classes.divider} />
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={filter.statusEnabled}
        onToggle={onToggleFilter("statusEnabled")}
        title="Status"
      >
        <OrderStatusFilter
          onChange={onChangeStatus}
          statuses={filter.statuses || []}
        />
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={filter.collectionEnabled}
        onToggle={onToggleFilter("collectionEnabled")}
        title="Collection"
      >
        <CollectionFilter
          collectionIds={filter.collectionIds || []}
          onChange={onChangeCollection}
        />
      </FilterItemWrapper>
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
