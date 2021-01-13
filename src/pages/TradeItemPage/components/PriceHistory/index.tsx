import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import chartMockData from "config/chartMockData.json";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highstockcharts from "highcharts/highstock";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .highcharts-range-selector-group": {
      "& .highcharts-range-selector-buttons": {
        "& .highcharts-button.highcharts-button-normal": {
          "& text": {
            color: `${theme.colors.text.seventh} !important`,
            fill: `${theme.colors.text.seventh} !important`,
          },
        },
      },
      "& .highcharts-input-group": {
        "& .highcharts-label.highcharts-range-input": {
          "& text": {
            color: `${theme.colors.text.seventh} !important`,
            fill: `${theme.colors.text.seventh} !important`,
          },
        },
      },
    },
  },
}));

interface IProps {
  className?: string;
}

export const PriceHistory = (props: IProps) => {
  const classes = useStyles();

  const ohlc = [],
    volume = [],
    dataLength = chartMockData.length;
  let i = 0;

  for (i; i < dataLength; i += 1) {
    ohlc.push([
      chartMockData[i][0], // the date
      chartMockData[i][4], // close
    ]);

    volume.push([
      chartMockData[i][0], // the date
      chartMockData[i][5], // the volume
    ]);
  }

  const options: Highcharts.Options = {
    title: { text: "" },
    chart: {
      backgroundColor: "#0000",
      zoomType: "x",
    },
    rangeSelector: {
      buttonPosition: { align: "right" },
      buttonTheme: {
        stroke: "#A6A9B7",
        fill: "#0000",
      },
      inputPosition: { align: "left" },
    },
    yAxis: [
      {
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "",
        },
        height: "60%",
        lineWidth: 0,
        gridLineWidth: 0,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Volume",
        },
        top: "65%",
        height: "35%",
        offset: 0,
        lineWidth: 0,
        gridLineWidth: 0,
        tickWidth: 0,
      },
    ],

    xAxis: {
      zoomEnabled: true,
      type: "datetime",
      gridLineWidth: 0,
      lineWidth: 0,
      tickWidth: 0,
    },

    tooltip: {
      split: true,
    },

    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },

    navigator: {
      outlineWidth: 0,
      handles: {
        borderColor: "#0000",
      },
    },

    scrollbar: {
      barBackgroundColor: "#A6A9B7",
      trackBackgroundColor: "#A6A9B755",
      barBorderColor: "#A6A9B7",
      trackBorderColor: "#A6A9B755",
    },

    series: [
      {
        type: "line",
        name: "Price",
        pointStart: ohlc[0][0],
        pointInterval: 24 * 3600 * 1000,
        data: ohlc,
        color: "#5F6BDD",
      },
      {
        type: "column",
        name: "Volume",
        id: "volume",
        data: volume,
        yAxis: 1,
        color: "#1F263C",
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <HighchartsReact
        constructorType={"stockChart"}
        highcharts={Highstockcharts}
        // highCharts={Highcharts}
        options={options}
      />
    </div>
  );
};
