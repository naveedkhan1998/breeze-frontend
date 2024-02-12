import { useGetCandlesQuery } from "../services/instrumentService";
import { Instrument } from "./HomePage";
import { useLocation } from "react-router-dom";
import { Table } from "flowbite-react";

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
  /* if (isSuccess) {
    console.log(data);
  } */
  //const candles: Candle[] = data.data as Candle[];

  // console.log(obj.id);

  return (
    <div className="h-[95dvh] dark:bg-black/80 ">
      <div className="overflow-x-auto">
        <Table striped hoverable>
          <Table.Head>
            <Table.HeadCell>Open</Table.HeadCell>
            <Table.HeadCell>High</Table.HeadCell>
            <Table.HeadCell>Low</Table.HeadCell>
            <Table.HeadCell>Close</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data &&
              data.data.map((candle: Candle) => (
                <Table.Row
                  key={candle.date}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {candle.open}
                  </Table.Cell>
                  <Table.Cell>{candle.high}</Table.Cell>
                  <Table.Cell>{candle.low}</Table.Cell>
                  <Table.Cell>{candle.close}</Table.Cell>
                  <Table.Cell>{candle.date}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default GraphsPage;
