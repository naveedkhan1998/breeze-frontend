import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Spinner, Table, Card } from "flowbite-react";
import { HiTrash, HiChartBar, HiRefresh } from "react-icons/hi";
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
const InstrumentTable: React.FC<{
  instruments: Instrument[];
  onDelete: (id: number, company_name: string) => void;
}> = ({ instruments, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <Table striped hoverable>
        <Table.Head>
          <Table.HeadCell>Company Name</Table.HeadCell>
          <Table.HeadCell>View Graph</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {instruments.map((instrument) => (
            <Table.Row key={instrument.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">{instrument.company_name}</Table.Cell>
              <Table.Cell>
                <Link to={`/graphs/${instrument.id}`} state={{ obj: instrument }}>
                  <Button size="sm" gradientDuoTone="tealToLime">
                    <HiChartBar className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </Link>
              </Table.Cell>
              <Table.Cell>
                <Button size="sm" gradientDuoTone="pinkToOrange" onClick={() => onDelete(instrument.id, instrument.company_name)}>
                  <HiTrash className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

// HomePage component
const HomePage: React.FC = () => {
  const { data, refetch } = useGetSubscribedInstrumentsQuery("");
  const [deleteInstrument] = useDeleteInstrumentMutation();
  const [isHealthChecking, setIsHealthChecking] = useState(false);

  const handleDelete = async (id: number) => {
    try {
      await deleteInstrument({ id });
      await refetch();
      toast.warn("Instrument Deleted");
    } catch (error) {
      console.error("Error deleting instrument:", error);
      toast.error("Failed to delete instrument");
    }
  };

  const performHealthCheck = async () => {
    setIsHealthChecking(true);
    const workers = [
      { name: "Worker 1", url: "https://breeze-backend-celery.onrender.com/" },
      { name: "Worker 2", url: "https://breeze-backend-celery-2.onrender.com/" },
      { name: "Worker 3", url: "https://breeze-backend-celery-3.onrender.com/" },
    ];

    const toastIds = workers.map((worker) => toast.loading(`Checking ${worker.name}...`, { position: "bottom-right" }));

    try {
      const responses = await Promise.all(
        workers.map((worker, index) =>
          fetch(worker.url)
            .then((response) => ({ worker, status: response.status, index }))
            .catch(() => ({ worker, status: "error", index }))
        )
      );

      responses.forEach(({ worker, status, index }) => {
        if (status === 200) {
          toast.update(toastIds[index], {
            render: `${worker.name}: Healthy`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.update(toastIds[index], {
            render: `${worker.name}: Unhealthy`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      });
    } catch (error) {
      console.error("Error during health checks:", error);
      workers.forEach((worker, index) => {
        toast.update(toastIds[index], {
          render: `${worker.name}: Check failed`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });
    } finally {
      setIsHealthChecking(false);
    }
  };

  useEffect(() => {
    performHealthCheck();
    const interval = setInterval(performHealthCheck, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-2 bg-gray-100 dark:bg-gray-900 sm:p-4">
      <Card className="w-full max-w-5xl mt-4 mb-4 sm:mt-8 sm:mb-8">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Subscribed Instruments</h1>
        <div className="flex flex-col items-start justify-between mb-4 space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          <Button onClick={performHealthCheck} disabled={isHealthChecking} color="light" size="sm" className="w-full sm:w-auto">
            <HiRefresh className={`mr-2 h-4 w-4 ${isHealthChecking ? "animate-spin" : ""}`} />
            {isHealthChecking ? "Checking..." : "Check Worker Health"}
          </Button>
          <Button onClick={() => refetch()} color="light" size="sm" className="w-full sm:w-auto">
            Refresh Data
          </Button>
        </div>
        {data ? (
          <InstrumentTable instruments={data.data} onDelete={handleDelete} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <Spinner size="xl" />
          </div>
        )}
      </Card>
    </div>
  );
};

export default HomePage;
