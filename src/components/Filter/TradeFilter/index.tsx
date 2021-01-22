import {
  Button,
  ButtonGroup,
  Divider,
  MenuItem,
  Select,
  makeStyles,
} from "@material-ui/core";
import clsx from "classnames";
import { MOCK_PRICE_FILTER_ITEMS } from "config/constants";
import React, { useState } from "react";

import FilterItemWrapper from "../FilterItemWrapper";
import PriceFilter from "../PriceFilter";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(1)}px 0`,
  },
  buy: {
    borderRadius: theme.spacing(0.5),
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
    marginTop: theme.spacing(3.5),
  },
  reset: {
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.colors.background.primary,
    height: theme.spacing(5),
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(4),
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
    typeEnabled: boolean;
    standardEnabled: boolean;
    colorEnabled: boolean;
    statusEnabled: boolean;
    collectionEnabled: boolean;
    membership: EMembership;
  };
}

const TradeFilter = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    filter: {
      priceEnabled: false,
      typeEnabled: false,
      standardEnabled: false,
      colorEnabled: false,
      statusEnabled: false,
      collectionEnabled: false,
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
    <div className={clsx(classes.root, props.className)}>
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
        enabled={state.filter.typeEnabled}
        onToggle={() => {
          updateFilter({ typeEnabled: !state.filter.typeEnabled });
        }}
        title="Type"
      >
        <div>Type</div>
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.standardEnabled}
        onToggle={() => {
          updateFilter({ standardEnabled: !state.filter.standardEnabled });
        }}
        title="Standard"
      >
        <div>Standard</div>
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.colorEnabled}
        onToggle={() => {
          updateFilter({ colorEnabled: !state.filter.colorEnabled });
        }}
        title="Color"
      >
        <div>Color</div>
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.statusEnabled}
        onToggle={() => {
          updateFilter({ statusEnabled: !state.filter.statusEnabled });
        }}
        title="Status"
      >
        <div>Status</div>
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={state.filter.collectionEnabled}
        onToggle={() => {
          updateFilter({ collectionEnabled: !state.filter.collectionEnabled });
        }}
        title="Collection"
      >
        <div>Collection</div>
      </FilterItemWrapper>
      <FilterItemWrapper
        enabled={false}
        onToggle={() => {
          //
        }}
        title="Price"
      >
        <div>Price</div>
      </FilterItemWrapper>
      <Button
        className={classes.reset}
        color="secondary"
        fullWidth
        variant="contained"
      >
        RESET FILTERS
      </Button>
    </div>
  );
};

export default TradeFilter;
