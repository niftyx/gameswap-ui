import { Button, Divider, makeStyles } from "@material-ui/core";
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
}));

interface IProps {
  className?: string;
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
    platformEnabled: boolean;
    platforms?: EPlatform[];
  };
}

const BrowseFilter = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const [state, setState] = useState<IState>({
    filter: {
      priceEnabled: false,
      statusEnabled: false,
      collectionEnabled: false,
      platformEnabled: false,
      saleCurrencyEnabled: false,
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

  const onChangePrice = ({ max, min }: { min?: number; max?: number }) => {
    setState((prevState) => ({
      ...prevState,
      filter: { ...prevState.filter, priceMin: min, priceMax: max },
    }));
  };

  const onChangePlatform = (platforms: EPlatform[]) => {
    setState((prevState) => ({
      ...prevState,
      filter: { ...prevState.filter, platforms },
    }));
  };

  const onChangeStatus = (statuses: EOrderStatus[]) => {
    setState((prev) => ({
      ...prev,
      filter: { ...prev.filter, statuses },
    }));
  };

  const onChangeCollection = (collectionIds: string[]) => {
    setState((prev) => ({
      ...prev,
      filter: { ...prev.filter, collectionIds },
    }));
  };

  const onChangeCurrencies = (currencies: KnownToken[]) => {
    setState((prev) => ({
      ...prev,
      filter: { ...prev.filter, currencies },
    }));
  };

  const onReset = () => {
    setState(() => ({
      filter: {
        priceEnabled: false,
        statusEnabled: false,
        collectionEnabled: false,
        saleCurrencyEnabled: false,
        platformEnabled: false,
      },
    }));
  };

  const onToggleFilter = (key: keyof IState["filter"]) => () => {
    updateFilter({
      [key]: !state.filter[key],
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
        BUY
      </Button>
      <FilterItemWrapper
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
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.platformEnabled}
        onToggle={onToggleFilter("platformEnabled")}
        title="Platform"
      >
        <PlatformFilter
          onChange={onChangePlatform}
          platforms={state.filter.platforms || []}
        />
        <Divider className={classes.divider} />
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.statusEnabled}
        onToggle={onToggleFilter("statusEnabled")}
        title="Status"
      >
        <OrderStatusFilter
          onChange={onChangeStatus}
          statuses={state.filter.statuses || []}
        />
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.collectionEnabled}
        onToggle={onToggleFilter("collectionEnabled")}
        title="Collection"
      >
        <CollectionFilter
          collectionIds={state.filter.collectionIds || []}
          onChange={onChangeCollection}
        />
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.saleCurrencyEnabled}
        onToggle={onToggleFilter("saleCurrencyEnabled")}
        title="Sale Currency"
      >
        <SaleCurrencyFilter
          currencies={state.filter.currencies || []}
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

export default BrowseFilter;
