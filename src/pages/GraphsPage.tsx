import { useRef, useEffect } from "react";
import { useGetCandlesQuery } from "../services/instrumentService";
import { Instrument } from "./HomePage";
import { useLocation } from "react-router-dom";
import { createChart, CandlestickData } from "lightweight-charts";
import { formatDate } from "../common-functions";

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  date: string; // Assuming date is always a string in YYYY-MM-DDTHH:MM:SS±HH:MM format
};

const GraphsPage = () => {
  const location = useLocation();
  const { obj }: { obj: Instrument } = location.state;
  const { data } = useGetCandlesQuery({ id: obj.id });
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data && chartContainerRef.current) {
      // Cleanup the chart when the component is unmounted
      chartContainerRef.current.innerHTML = "";
      // Create a new chart
      const chart = createChart(chartContainerRef.current!, {
        width: 1200,
        height: 800,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          // tickMarkFormatter: (time: number) => {
          //   const date = new Date(time * 1000);
          //   const hours = date.getHours();
          //   const minutes = date.getMinutes();
          //   const period = hours >= 12 ? "PM" : "AM";
          //   const formattedHours = hours % 12 || 12;
          //   return `${formattedHours}:${
          //     minutes < 10 ? "0" : ""
          //   }${minutes} ${period}`;
          // },
        },
        crosshair: {
          mode: 0,
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
    }
  }, [data]);

  // Render your chart container here
  return (
    <div className="h-[95dvh] dark:bg-black/80 items-center flex justify-center">
      <div ref={chartContainerRef} />
    </div>
  );
};

export default GraphsPage;
