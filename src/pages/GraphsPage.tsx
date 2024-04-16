import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Dropdown, Spinner } from "flowbite-react";
import { createChart, CandlestickData } from "lightweight-charts";
import {
  useGetCandlesQuery,
  useLoadInstrumentCandlesMutation,
} from "../services/instrumentService";
import { formatDate } from "../common-functions";
import { Candle } from "../common-types";
import { useAppSelector } from "../app/hooks";
import { getMode } from "../features/darkModeSlice";
import { Instrument } from "./HomePage";

const GraphsPage: React.FC = () => {
  const location = useLocation();
  const mode = useAppSelector(getMode);
  const { obj }: { obj: Instrument } = location.state;
  const [timeframe, setTimeFrame] = useState<number>(5);
  const { data, refetch, isLoading, isFetching } = useGetCandlesQuery({
    id: obj.id,
    tf: timeframe,
  });

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

  const [loadInstrumentCandles] = useLoadInstrumentCandlesMutation();

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({
          width: window.innerWidth * 0.9,
          height: window.innerHeight * 0.7,
        });
      }
    };

    const renderChart = () => {
      if (chartContainerRef.current && data) {
        chartContainerRef.current.innerHTML = "";
        const chart = createChart(chartContainerRef.current, {
          width: window.innerWidth * 0.9,
          height: window.innerHeight * 0.7,
          layout: {
            textColor: mode ? "#FFFFFF" : "#191919",
            background: {
              color: mode ? "#191919" : "#FFFFFF",
            },
            fontSize: 12,
          },
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
          rightPriceScale: {
            minimumWidth: 1,
            borderVisible: true,
            alignLabels: true,
            scaleMargins: {
              top: 0.4,
              bottom: 0.15,
            },
          },
          crosshair: {
            mode: 0,
            horzLine: {
              visible: true,
              labelVisible: true,
            },
          },
          grid: {
            vertLines: {
              visible: true,
            },
            horzLines: {
              visible: true,
            },
          },
        });

        const series = chart.addCandlestickSeries({
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
        });
        const seriesData: CandlestickData[] = data.data.map(
          ({ date, open, high, low, close }: Candle) => ({
            time: formatDate(date),
            open,
            high,
            low,
            close,
          })
        );

        series.setData(seriesData);

        const legendContainer = document.createElement("div");
        legendContainer.className = `graphlegend`;

        chartContainerRef.current.insertBefore(
          legendContainer,
          chartContainerRef.current.firstChild
        );

        const legendRow = document.createElement("div");
        legendRow.innerHTML = `${obj.company_name} | ${obj.exchange_code} | Timeframe: ${timeframe}`;

        legendContainer.appendChild(legendRow);
        // Create a new row for OHLC values
        const ohlcRow = document.createElement("div");
        ohlcRow.innerHTML = "<strong>OHLC:</strong> ";
        legendContainer.appendChild(ohlcRow);

        chart.subscribeCrosshairMove((param) => {
          let ohlcValues = "";
          if (param.time) {
            const data = param.seriesData.get(series);
            if (data) {
              if ("close" in data) {
                const close = (data as CandlestickData).close;
                const open = (data as CandlestickData).open;
                const high = (data as CandlestickData).high;
                const low = (data as CandlestickData).low;
                ohlcValues = `<strong>O:</strong> ${open} | <strong>H:</strong> ${high} | <strong>L:</strong> ${low} | <strong>C:</strong> ${close}`;
              }
            }
          }
          legendRow.innerHTML = `${obj.company_name} | ${obj.exchange_code} | Timeframe: ${timeframe}`;
          ohlcRow.innerHTML = `<strong>OHLC:</strong> ${ohlcValues}`;
        });

        chartRef.current = chart;
      }
    };

    renderChart();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, mode, obj.company_name, obj.exchange_code, timeframe]);

  const handleTfChange = (tf: number) => {
    setTimeFrame(tf);
    if (timeframe === tf) {
      refetch();
    }
  };

  const handleClick = (id: number) => {
    loadInstrumentCandles({ id });
    refetch();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen m-auto overflow-auto dark:bg-gray-900 h-fit">
      {isLoading || isFetching ? (
        <div className="text-center">
          <Spinner className="flex m-auto size-60" />
        </div>
      ) : (
        <>
          <div className="z-20 p-6 dark:text-white">
            <Button.Group outline>
              <Button>{obj.company_name}</Button>
              <Button>{obj.exchange_code}</Button>
              <Button>Timeframe: {timeframe}</Button>
            </Button.Group>
            <Button.Group>
              <Dropdown label="Set TimeFrame" size="sm">
                <Dropdown.Item onClick={() => handleTfChange(5)}>
                  5
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleTfChange(10)}>
                  10
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleTfChange(15)}>
                  15
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleTfChange(30)}>
                  30
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => {
                    const customTimeFrame = prompt("Enter custom time frame:");
                    if (customTimeFrame !== null) {
                      const parsedTimeFrame = parseInt(customTimeFrame, 10);
                      if (!isNaN(parsedTimeFrame)) {
                        handleTfChange(parsedTimeFrame);
                      } else {
                        alert("Invalid input. Please enter a valid number.");
                      }
                    }
                  }}
                >
                  Custom +
                </Dropdown.Item>
              </Dropdown>
              <Button onClick={() => handleClick(obj.id)}>Load Candles</Button>
            </Button.Group>
          </div>
          <div
            ref={chartContainerRef}
            className="flex flex-col items-center justify-center rounded ring-1"
          ></div>
        </>
      )}
    </div>
  );
};

export default GraphsPage;
