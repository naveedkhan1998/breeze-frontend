import { useGetSubscribedInstrumentsQuery } from "../services/instrumentService";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

export type Instrument = {
  id: number;
  stock_token: string;
  token: string;
  instrument: string | null; // nullable due to potential null value in data
  short_name: string;
  series: string;
  company_name: string;
  expiry: string | null; // nullable due to potential null value in data
  strike_price: number;
  option_type: string | null; // nullable due to potential null value in data
  exchange_code: string;
  exchange: number;
};

const HomePage = () => {
  const { data } = useGetSubscribedInstrumentsQuery("");

  return (
    <div className="h-[95dvh] dark:bg-black/80">
      <div className="overflow-x-auto">
        <Table striped hoverable>
          <Table.Head>
            <Table.HeadCell>Company Name</Table.HeadCell>
            <Table.HeadCell>Token</Table.HeadCell>
            <Table.HeadCell>Instrument</Table.HeadCell>
            <Table.HeadCell>Exchange</Table.HeadCell>
            <Table.HeadCell>Expiry</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data &&
              data.data.map((instrument: Instrument) => (
                <Table.Row key={instrument.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {instrument.company_name}
                  </Table.Cell>
                  <Table.Cell>{instrument.token}</Table.Cell>
                  <Table.Cell>{instrument.instrument}</Table.Cell>
                  <Table.Cell>{instrument.exchange_code}</Table.Cell>
                  <Table.Cell>{instrument.expiry}</Table.Cell>
                  <Table.Cell>
                  <Link
                      to={`/graphs/${instrument.id}`}
                      state={{ obj:instrument }} // Pass instrument object in state
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      View Candles
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            

          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default HomePage;
