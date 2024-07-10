import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Dropdown, Spinner, Card } from "flowbite-react";
import { createChart, CandlestickData, IChartApi } from "lightweight-charts";
import { useGetCandlesQuery, useLoadInstrumentCandlesMutation } from "../services/instrumentService";
import { formatDate } from "../common-functions";
import { Candle } from "../common-types";
import { useAppSelector } from "../app/hooks";
import { getMode } from "../features/darkModeSlice";
import { Instrument } from "./HomePage";
import { HiArrowLeft, HiRefresh, HiClock } from "react-icons/hi";

const GraphsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = useAppSelector(getMode);
  const { obj }: { obj: Instrument } = location.state;
  const [timeframe, setTimeFrame] = useState<number>(60);
  const { data, refetch, isLoading, isFetching } = useGetCandlesQuery({
    id: obj.id,
    tf: timeframe,
  });

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const [loadInstrumentCandles] = useLoadInstrumentCandlesMutation();

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        const height = window.innerHeight * 0.6;
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height,
        });
        chartContainerRef.current.style.height = `${height}px`;
      }
    };

    const renderChart = () => {
      if (chartContainerRef.current && data) {
        chartContainerRef.current.innerHTML = "";
        const height = window.innerHeight * 0.6;
        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height,
          layout: {
            textColor: mode ? "#FFFFFF" : "#191919",
            background: { color: mode ? "#1F2937" : "#F3F4F6" },
            fontSize: 12,
          },
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
          rightPriceScale: {
            borderColor: mode ? "#374151" : "#D1D5DB",
          },
          crosshair: {
            mode: 0,
            vertLine: {
              width: 1,
              color: mode ? "#4B5563" : "#9CA3AF",
              style: 1,
            },
            horzLine: {
              visible: true,
              labelVisible: true,
            },
          },
          grid: {
            vertLines: {
              color: mode ? "#374151" : "#E5E7EB",
            },
            horzLines: {
              color: mode ? "#374151" : "#E5E7EB",
            },
          },
        });

        const series = chart.addCandlestickSeries({
          upColor: "#10B981",
          downColor: "#EF4444",
          borderVisible: false,
          wickUpColor: "#10B981",
          wickDownColor: "#EF4444",
        });

        const seriesData: CandlestickData[] = data.data.map(({ date, open, high, low, close }: Candle) => ({
          time: formatDate(date),
          open,
          high,
          low,
          close,
        }));

        series.setData(seriesData);

        const legendContainer = document.createElement("div");
        legendContainer.className = `absolute top-4 left-4 bg-white dark:bg-gray-800 dark:text-white p-2 rounded shadow-md text-sm z-10`;

        chartContainerRef.current.appendChild(legendContainer);

        const legendRow = document.createElement("div");
        legendRow.className = "mb-1 font-semibold";
        legendRow.innerHTML = `${obj.company_name} | ${obj.exchange_code} | Timeframe: ${timeframe}`;

        const ohlcRow = document.createElement("div");
        ohlcRow.innerHTML = "<strong>OHLC:</strong> ";

        legendContainer.appendChild(legendRow);
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
                ohlcValues = `<strong>O:</strong> ${open.toFixed(2)} | <strong>H:</strong> ${high.toFixed(2)} | <strong>L:</strong> ${low.toFixed(2)} | <strong>C:</strong> ${close.toFixed(2)}`;
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
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <Button color="light" onClick={() => navigate(-1)}>
            <HiArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{obj.company_name} Chart</h2>
          <Button color="light" onClick={() => refetch()}>
            <HiRefresh className="w-5 h-5 mr-2" /> Refresh
          </Button>
        </div>

        {isLoading || isFetching ? (
          <div className="flex items-center justify-center h-96">
            <Spinner size="xl" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              <Dropdown label={`Timeframe: ${timeframe}`} size="sm" className="z-50">
                {[5, 10, 15, 30].map((tf) => (
                  <Dropdown.Item key={tf} onClick={() => handleTfChange(tf)}>
                    {tf}
                  </Dropdown.Item>
                ))}
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
              <Button size="sm" onClick={() => handleClick(obj.id)}>
                <HiClock className="w-4 h-4 mr-2" /> Load Candles
              </Button>
            </div>
            <div ref={chartContainerRef} className="relative w-full overflow-hidden rounded-lg"></div>
          </>
        )}
      </Card>
    </div>
  );
};

export default GraphsPage;
