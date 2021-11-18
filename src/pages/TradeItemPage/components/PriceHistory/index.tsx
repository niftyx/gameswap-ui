import { BigNumber } from "@ethersproject/bignumber";
import { CircularProgress, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID, PRICE_DECIMALS } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highstockcharts from "highcharts/highstock";
import React from "react";
import { formatBigNumber } from "utils";
import { EHistoryItemType } from "utils/enums";
import { IHistoryItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .highcharts-range-selector-group": {
      "& .highcharts-range-selector-buttons": {
        "& .highcharts-button.highcharts-button-normal": {
          "& text": {
            color: `${theme.colors.white} !important`,
            fill: `${theme.colors.white} !important`,
          },
        },
      },
      "& .highcharts-input-group": {
        "& .highcharts-label.highcharts-range-input": {
          "& text": {
            color: `${theme.colors.white} !important`,
            fill: `${theme.colors.white} !important`,
          },
        },
      },
    },
  },
  empty: {
    color: theme.colors.white,
    fontSize: 20,
  },
}));

interface IProps {
  className?: string;
  tradeHistoryData: {
    history: IHistoryItem[];
    loading: boolean;
  };
}

export const PriceHistory = (props: IProps) => {
  const classes = useStyles();
  const {
    tradeHistoryData: { history: historyItems, loading },
  } = props;
  const { networkId } = useConnectedWeb3Context();
  const {
    data: { price },
  } = useGlobal();

  const saleHistoryItems = historyItems
    .filter((item) => item.type === EHistoryItemType.Sale)
    .map((item) => ({
      timestamp: item.timestamp,
      price: item.price as Required<{
        tokenAddress: string;
        amount: BigNumber;
      }>,
    }));

  const renderChart = () => {
    // if (saleHistoryItems.length === 0) {
    //   return (
    //     <Typography align="center" className={classes.empty}>
    //       No Price History
    //     </Typography>
    //   );
    // }
    let chartData = saleHistoryItems.map((item) => {
      const token = getTokenFromAddress(item.price.tokenAddress, networkId);

      const dollar = item.price.amount.mul(
        (price as any)[token.symbol.toLowerCase()].price
      );
      return [
        item.timestamp * 1000,
        Number(formatBigNumber(dollar, token.decimals + PRICE_DECIMALS)),
        1,
      ];
    });

    if (chartData.length === 0) {
      chartData = [
        [1604869032000, 100, 1],
        [1609869032000, 300, 1],
        [1616869032000, 200, 1],
        [1619869032000, 600, 1],
        [1628869032000, 700, 1],
      ];
    }

    const ohlc = [],
      volume = [],
      dataLength = chartData.length;
    let i = 0;

    for (i; i < dataLength; i += 1) {
      ohlc.push([
        chartData[i][0], // the date
        chartData[i][1], // close
      ]);

      volume.push([
        chartData[i][0], // the date
        chartData[i][2], // the volume
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
        enabled: false,
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
      <HighchartsReact
        constructorType={"stockChart"}
        highcharts={Highstockcharts}
        // highCharts={Highcharts}
        options={options}
      />
    );
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      {loading ? <CircularProgress color="primary" size={40} /> : renderChart()}
    </div>
  );
};
