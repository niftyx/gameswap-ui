import {
  FilledInput,
  InputAdornment,
  Slider,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import RemoveIcon from "@material-ui/icons/Remove";
import { ReactComponent as SliderTagIcon } from "assets/svgs/thumb-tag.svg";
import clsx from "clsx";
import { PRICE_FILTER_COLUMN_COUNT } from "config/constants";
import React from "react";
import { IPriceFilterItem } from "utils/types";

const AirbnbSlider = withStyles((theme) => ({
  root: {
    color: theme.colors.background.eighth,
    height: 3,
    padding: "13px 0",
  },
  thumb: {
    height: theme.spacing(2),
    width: theme.spacing(2),
    marginTop: 3,
    marginLeft: -8,
    backgroundColor: theme.colors.transparent,
    "&::after": {
      top: -10,
      left: -10,
      right: -10,
      bottom: -10,
    },
  },
  active: {},
  track: {
    height: 3,
  },
  rail: {
    color: theme.colors.text.default,

    opacity: 1,
    height: 3,
  },
}))(Slider);

function AirbnbThumbComponent(props: any) {
  return (
    <span {...props}>
      <SliderTagIcon />
    </span>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
  },
  inputItem: {
    minWidth: "auto",
    flex: 1,
    borderRadius: 6,
    backgroundColor: theme.colors.background.fifth,
    "& input": {
      padding: theme.spacing(1),
      paddingLeft: 0,
    },
  },
  icon: {
    color: theme.colors.text.default,
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  slider: {
    userSelect: "none",
    padding: `0 8px`,
    marginBottom: theme.spacing(2),
  },
  chartWrapper: {
    position: "relative",
    paddingTop: "30%",
    marginBottom: -10,
  },
  chartContentWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    display: "flex",
    alignItems: "flex-end",
  },
  chartItem: {
    margin: "0 1px",
    userSelect: "none",
    backgroundColor: theme.colors.text.default,
    "&.active": {
      backgroundColor: theme.colors.background.eighth,
    },
  },
}));

interface IProps {
  className?: string;
  min?: number;
  max?: number;
  items: IPriceFilterItem[];
  onChange?: (params: { min?: number; max?: number }) => void;
}

const PriceFilter = (props: IProps) => {
  const classes = useStyles();
  const { items, max, min, onChange } = props;

  const renderSlider = () => {
    if (items.length === 0) return null;

    const sortedItems: IPriceFilterItem[] = [...items];
    sortedItems.sort((e1, e2) => {
      if (e1.price < e2.price) return -1;
      if (e1.price > e2.price) return 1;
      return 0;
    });

    const minPrice = sortedItems[0].price;
    const maxPrice = sortedItems[sortedItems.length - 1].price;

    const value = [min ? min : minPrice, max ? max : maxPrice];

    const columnCount =
      maxPrice - minPrice > PRICE_FILTER_COLUMN_COUNT
        ? PRICE_FILTER_COLUMN_COUNT
        : Math.floor(maxPrice) - Math.ceil(minPrice);
    const columnsInfo: { amount: number; min: number; max: number }[] = [];

    const columnDiff = (maxPrice - minPrice) / columnCount;
    let maxRowAmount = 0;
    for (let index = 0; index < columnCount; index += 1) {
      const columnMin = columnDiff * index + minPrice;
      const columnMax =
        index < columnCount - 1
          ? columnDiff * (index + 1) + minPrice
          : maxPrice + 0.0000001;
      const amounts = sortedItems
        .filter((e) => e.price < columnMax && e.price >= columnMin)
        .map((e) => e.amount);
      const columnAmount =
        amounts.length === 0
          ? 0
          : amounts.length === 1
          ? amounts[0]
          : amounts.reduce((cur, e) => cur + e);

      maxRowAmount = maxRowAmount < columnAmount ? columnAmount : maxRowAmount;

      columnsInfo.push({
        min: columnMin,
        max: columnMax,
        amount: columnAmount,
      });
    }

    return (
      <div className={classes.slider}>
        <div className={classes.chartWrapper}>
          <div className={classes.chartContentWrapper}>
            {columnsInfo.map((column, index) => {
              const shareMin = Math.max(value[0], column.min);
              const shareMax = Math.min(value[1], column.max);
              const isActive = shareMin < shareMax;
              return (
                <div
                  className={clsx(classes.chartItem, isActive ? "active" : "")}
                  key={index}
                  style={{
                    width: `calc(${100 / columnCount}% - 2px)`,
                    height: `${(column.amount * 100) / maxRowAmount}%`,
                  }}
                />
              );
            })}
          </div>
        </div>
        <AirbnbSlider
          ThumbComponent={AirbnbThumbComponent}
          getAriaLabel={(index) =>
            index === 0 ? "Minimum price" : "Maximum price"
          }
          max={maxPrice}
          min={minPrice}
          onChange={(_, newValue: number[] | number) => {
            if (Array.isArray(newValue) && newValue.length === 2 && onChange)
              onChange({ min: newValue[0], max: newValue[1] });
          }}
          value={value}
        />
      </div>
    );
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      {renderSlider()}
      <div className={classes.inputRow}>
        <FilledInput
          className={classes.inputItem}
          disableUnderline
          onChange={(event) => {
            if (onChange) onChange({ min: Number(event.target.value), max });
          }}
          placeholder="0.00"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          type="number"
          value={min}
        />
        <RemoveIcon className={classes.icon} />
        <FilledInput
          className={classes.inputItem}
          disableUnderline
          onChange={(event) => {
            if (onChange) onChange({ min, max: Number(event.target.value) });
          }}
          placeholder="max"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          type="number"
          value={max}
        />
      </div>
    </div>
  );
};

export default PriceFilter;
