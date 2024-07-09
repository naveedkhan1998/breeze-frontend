import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Spinner, Table } from "flowbite-react";
import { HiTrash, HiChartBar } from "react-icons/hi";
import { useDeleteInstrumentMutation, useGetSubscribedInstrumentsQuery } from "../services/instrumentService";
import { toast } from "react-toastify";

// Define the Instrument interface
export interface Instrument {
  id: number;
  stock_token: string;
  token: string;
  instrument: string | null;
  short_name: string;
  series: string;
  company_name: string;
  expiry: string | null;
  strike_price: number;
  option_type: string | null;
  exchange_code: string;
  exchange: number;
}

// InstrumentTable component
const InstrumentTable: React.FC<{
  instruments: Instrument[];
  onDelete: (id: number, company_name: string) => void;
}> = ({ instruments, onDelete }) => {
  return (
    <Table striped hoverable className="w-[90dvw] ">
      <Table.Head>
        <Table.HeadCell>Company Name</Table.HeadCell>
        <Table.HeadCell>View Graph</Table.HeadCell>
        <Table.HeadCell>Delete</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {instruments.map((instrument) => (
          <Table.Row key={instrument.id} className="bg-white dark:border-gray-800 dark:bg-gray-800">
            <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">{instrument.company_name}</Table.Cell>
            <Table.Cell>
              <Link to={`/graphs/${instrument.id}`} state={{ obj: instrument }} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                <Button pill gradientDuoTone="tealToLime">
                  <HiChartBar />
                </Button>
              </Link>
            </Table.Cell>
            <Table.Cell>
              <Button pill gradientDuoTone="pinkToOrange" onClick={() => onDelete(instrument.id, instrument.company_name)}>
                <HiTrash />
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

// HomePage component
const HomePage: React.FC = () => {
  const { data, refetch } = useGetSubscribedInstrumentsQuery("");
  const [deleteInstrument] = useDeleteInstrumentMutation();

  const handleDelete = async (id: number, company_name: string) => {
    if (company_name !== "NIFTY 50" && company_name !== "NIFTY BANK") {
      try {
        await deleteInstrument({ id });
        await refetch();
        toast.warn("Instrument Deleted");
      } catch (error) {
        console.error("Error deleting instrument:", error);
        toast.error("Failed to delete instrument");
      }
    } else {
      toast.error("Delete Not Allowed For This!");
    }
  };

  useEffect(() => {
    const urls = ["https://breeze-backend-celery.onrender.com/", "https://breeze-backend-celery-2.onrender.com/", "https://breeze-backend-celery-3.onrender.com/"];

    const checkHealth = async () => {
      try {
        const responses = await Promise.all(urls.map((url) => fetch(url).then((response) => ({ url, status: response.status }))));
        responses.forEach(({ url, status }) => {
          if (status === 200) {
            toast.success(`Health check successful for ${url}`);
          } else {
            toast.error(`Health check failed for ${url}`);
          }
        });
      } catch (error) {
        console.error("Error during health checks:", error);
        toast.error("Health check failed");
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full min-h-screen dark:bg-gray-900 justify-normal">
      <div className="m-10 text-4xl text-gray-900 dark:text-white">
        <span>Subscribed Instruments</span>
      </div>
      <div className="justify-start pb-32 ">{data ? <InstrumentTable instruments={data.data} onDelete={handleDelete} /> : <Spinner className="flex m-auto size-60" />}</div>
    </div>
  );
};

export default HomePage;
