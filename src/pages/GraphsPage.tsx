import { useRef, useEffect, useState } from "react";
import {
  useGetCandlesQuery,
  useLoadInstrumentCandlesMutation,
} from "../services/instrumentService";
import { Instrument } from "./HomePage";
import { useLocation } from "react-router-dom";
import {
  createChart,
  CandlestickData,
  CrosshairMode,
} from "lightweight-charts";
import { formatDate } from "../common-functions";
import { Dropdown, Spinner, Button } from "flowbite-react";
import { Candle } from "../common-types";

const GraphsPage = () => {
  const location = useLocation();
  const { obj }: { obj: Instrument } = location.state;
  const [timeframe, setTimeFrame] = useState(5);
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
        const chart = createChart(chartContainerRef.current!, {
          width: window.innerWidth * 0.9,
          height: window.innerHeight * 0.7,
          layout: {
            fontSize: 14,
          },
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
          crosshair: {
            mode: CrosshairMode.Normal,
          },
        });

        const series = chart.addCandlestickSeries();
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

        chartRef.current = chart;
      }
    };

    renderChart();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data]);

  const handleTfChange = (tf: number) => {
    setTimeFrame(tf);
    if (timeframe === tf) {
      refetch();
    }
  };

  const handleClick = (id: number) => {
    loadInstrumentCandles({ id: id });
    //console.log(id);
  };

  return (
    <div className="h-[95vh] dark:bg-black/80 items-center flex justify-center flex-col">
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
