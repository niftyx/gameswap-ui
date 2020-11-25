import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { transparentize } from "polished";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(6),
    },
  },
  headerItem: {
    userSelect: "none",
    fontSize: theme.spacing(3),
    color: theme.colors.text.third,
    cursor: "pointer",
    transition: "all 0.3s",
    "&.active": {
      color: theme.colors.text.default,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    "& > * + *": {
      marginLeft: theme.spacing(1.75),
    },
  },
  toolbarItem: {
    width: theme.spacing(4.25),
    height: theme.spacing(4.25),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.colors.transparent,
    fontSize: theme.spacing(1.6125),
    color: theme.colors.text.seventh,
    cursor: "pointer",
    transition: "all 0.3s",
    border: `2px solid ${theme.colors.border.fourth}`,
    "&.active": {
      color: theme.colors.text.default,
      borderColor: theme.colors.background.fourth,
      backgroundColor: theme.colors.background.fourth,
    },
  },
}));

const chartLabels = [
  { label: "1H", hours: 1 },
  { label: "1D", hours: 24 },
  { label: "7D", hours: 168 },
  { label: "1M", hours: 5040 },
  { label: "3M", hours: 15120 },
  { label: "6M", hours: 30240 },
  { label: "1Y", hours: 60480 },
];
interface IProps {
  className?: string;
}

enum EChart {
  priceHistory = "Price History",
  tradeHistory = "Trade History",
}
interface IState {
  chart: EChart;
  duration: number;
}

export const ChartSection = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    chart: EChart.priceHistory,
    duration: chartLabels[0].hours,
  });
  const setChart = (chart: EChart) =>
    setState((prevState) => ({ ...prevState, chart }));

  const setDuration = (duration: number) =>
    setState((prevState) => ({ ...prevState, duration }));

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        {Object.values(EChart).map((value) => (
          <span
            className={clsx(
              classes.headerItem,
              state.chart === value ? "active" : ""
            )}
            key={value}
            onClick={() => setChart(value)}
          >
            {value}
          </span>
        ))}
      </div>
      <div className={classes.toolbar}>
        {chartLabels.map((item) => (
          <span
            className={clsx(
              classes.toolbarItem,
              state.duration === item.hours ? "active" : ""
            )}
            key={item.label}
            onClick={() => setDuration(item.hours)}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};
