import {
  useDeleteInstrumentMutation,
  useGetSubscribedInstrumentsQuery,
} from "../services/instrumentService";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiTrash,HiChartBar } from "react-icons/hi";

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
  const { data, refetch } = useGetSubscribedInstrumentsQuery("");
  const [deleteInstrument] = useDeleteInstrumentMutation();

  const handleDelete = (id: number) => {
    deleteInstrument({ id: id });
    refetch();
  };

  return (
    <div className="dark:bg-gray-900 h-[94.5dvh] items-center justify-normal flex flex-col">
      <div className="dark:text-white text-4xl  text-gray-900 m-10">
        <p>Subscribed Instruments</p>
      </div>
      <div className="overflow-auto max-h-[70dvh] w-[90dvw] ">
        <Table striped hoverable>
          <Table.Head>
            <Table.HeadCell>Company Name</Table.HeadCell>
            <Table.HeadCell>View Graph</Table.HeadCell>

            {/* <Table.HeadCell>Instrument</Table.HeadCell> */}
            <Table.HeadCell>Exchange</Table.HeadCell>
            {/* <Table.HeadCell>Expiry</Table.HeadCell> */}
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data &&
              data.data.map((instrument: Instrument) => (
                <Table.Row
                  key={instrument.id}
                  className="bg-white dark:border-gray-800 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {instrument.company_name}
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/graphs/${instrument.id}`}
                      state={{ obj: instrument }} // Pass instrument object in state
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      <Button 
                      pill
                      outline gradientDuoTone="tealToLime">
                        <HiChartBar/>
                      </Button>
                    </Link>
                  </Table.Cell>
                  {/*  <Table.Cell>{instrument.instrument}</Table.Cell> */}
                  <Table.Cell>{instrument.exchange_code}</Table.Cell>
                  {/* <Table.Cell>{instrument.expiry}</Table.Cell> */}

                  <Table.Cell>
                    <Button
                      pill
                      outline
                      gradientDuoTone="pinkToOrange"
                      onClick={() => handleDelete(instrument.id)}
                    >
                      <HiTrash />
                    </Button>
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
