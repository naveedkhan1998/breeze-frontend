import { useRef, useEffect, useState } from "react";
import {
  useGetCandlesQuery,
  useLoadInstrumentCandlesMutation,
} from "../services/instrumentService";
import { Instrument } from "./HomePage";
import { useLocation } from "react-router-dom";
import { createChart, CandlestickData } from "lightweight-charts";
import { formatDate } from "../common-functions";
import { Dropdown, Spinner, Button } from "flowbite-react";
import { Candle } from "../common-types";
import { useAppSelector } from "../app/hooks";
import { getMode } from "../features/darkModeSlice";

const GraphsPage = () => {
  const location = useLocation();
  const mode = useAppSelector(getMode);
  const { obj }: { obj: Instrument } = location.state;
  const [timeframe, setTimeFrame] = useState(5); // default tf = 5
  const { data, refetch, isLoading } = useGetCandlesQuery({
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
            textColor:
              localStorage.getItem("flowbite-theme-mode") === "dark"
                ? "#FFFFFF"
                : "#374151",
            background: {
              color:
                localStorage.getItem("flowbite-theme-mode") === "dark"
                  ? "#374151"
                  : "#FFFFFF",
            },

            fontSize: 14,
          },
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
          rightPriceScale: {
            scaleMargins: {
              top: 0.4, // leave some space for the legend
              bottom: 0.15,
            },
          },
          crosshair: {
            // hide the horizontal crosshair line
            horzLine: {
              visible: false,
              labelVisible: true,
            },
          },
          // hide the grid lines
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

        // Add legend
        const legendContainer = document.createElement("div");
        legendContainer.className = `z-10 text-lg font-sans leading-5 font-light bg-slate-200 dark:bg-slate-700 dark:text-white rounded p-2 shadow-md`;

        chartContainerRef.current.insertBefore(
          legendContainer,
          chartContainerRef.current.firstChild
        );

        const legendRow = document.createElement("div");
        legendRow.innerHTML = `${obj.company_name} | ${obj.exchange_code} | Timeframe: ${timeframe}`;

        legendContainer.appendChild(legendRow);

        chart.subscribeCrosshairMove((param) => {
          let priceFormatted = "";
          if (param.time) {
            const data = param.seriesData.get(series);
            if (data) {
              if ("close" in data) {
                const price = (data as CandlestickData).close;
                priceFormatted = String(price);
              }
            }
          }
          legendRow.innerHTML = `${obj.company_name} | ${obj.exchange_code} | Timeframe: ${timeframe} | <strong>${priceFormatted}</strong>`;
        });

        chartRef.current = chart;
      }
    };

    renderChart();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, mode]);

  const handleTfChange = (tf: number) => {
    setTimeFrame(tf);
    if (timeframe === tf) {
      refetch();
    }
  };

  const handleClick = (id: number) => {
    loadInstrumentCandles({ id: id });
    refetch();
    //console.log(id);
  };

  return (
    <div className="dark:bg-gray-900 h-[94.5dvh] items-center flex justify-center flex-col">
      {isLoading ? (
        <div className="text-center">
          <Spinner size="xl" aria-label="Center-aligned spinner example" />
        </div>
      ) : (
        <>
          <div className="dark:text-white flex flex-wrap gap-2">
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
          <div ref={chartContainerRef}></div>
        </>
      )}
    </div>
  );
};

export default GraphsPage;
