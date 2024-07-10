import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Spinner, Table, Card } from "flowbite-react";
import { HiTrash, HiChartBar, HiRefresh } from "react-icons/hi";
import { useDeleteInstrumentMutation, useGetSubscribedInstrumentsQuery } from "../services/instrumentService";
import { toast } from "react-toastify";

// Define the Instrument interface
export interface PercentageInstrument {
  percentage: number;
  is_loading: boolean;
}

export interface Instrument {
  id: number;
  percentage: PercentageInstrument[];
  stock_token: string | null;
  token: string | null;
  instrument: string | null;
  short_name: string | null;
  series: string | null;
  company_name: string | null;
  expiry: string | null;
  strike_price: number | null;
  option_type: string | null;
  exchange_code: string | null;
  exchange: number;
}

const InstrumentTable: React.FC<{
  instruments: Instrument[];
  onDelete: (id: number) => void;
  deletingRowIds: number[];
}> = ({ instruments, onDelete, deletingRowIds }) => {
  return (
    <div className="overflow-x-auto">
      <Table striped hoverable>
        <Table.Head>
          <Table.HeadCell className="px-6 py-3">Company Name</Table.HeadCell>
          <Table.HeadCell className="px-6 py-3">Progress</Table.HeadCell>
          <Table.HeadCell className="px-6 py-3">Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {instruments.map((instrument) => (
            <Table.Row key={instrument.id} className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${deletingRowIds.includes(instrument.id) ? "opacity-50 cursor-wait" : ""}`}>
              <Table.Cell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{instrument.company_name}</Table.Cell>
              <Table.Cell className="px-6 py-4">
                {instrument.percentage.length > 0 ? (
                  instrument.percentage.map((p, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${p.percentage}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{p.percentage.toFixed(2)}%</span>
                      {p.is_loading ? null : <Spinner size="sm" />}
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">No data</span>
                )}
              </Table.Cell>
              <Table.Cell className="px-6 py-4">
                <div className="flex space-x-2">
                  <Link to={`/graphs/${instrument.id}`} state={{ obj: instrument }}>
                    <Button size="sm" gradientDuoTone="tealToLime">
                      <HiChartBar className="w-4 h-4 mr-2" />
                      View Graph
                    </Button>
                  </Link>
                  <Button size="sm" gradientDuoTone="pinkToOrange" onClick={() => onDelete(instrument.id)}>
                    <HiTrash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
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
  const [deletingRowIds, setDeletingRowIds] = useState<number[]>([]);
  const [isHealthChecking, setIsHealthChecking] = useState(false);

  const handleDelete = async (id: number) => {
    setDeletingRowIds((prevIds) => [...prevIds, id]);
    try {
      await deleteInstrument({ id });
      await refetch();
      toast.warn("Instrument Deleted");
    } catch (error) {
      console.error("Error deleting instrument:", error);
      toast.error("Failed to delete instrument");
    } finally {
      setDeletingRowIds((prevIds) => prevIds.filter((rowId) => rowId !== id));
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

  useEffect(() => {
    const interval = setInterval(async () => {
      const allLoaded = data?.data.every((instrument: Instrument) => instrument.percentage.length > 0 && instrument.percentage.every((p) => p.is_loading));

      if (!allLoaded) {
        await refetch();
      } else {
        clearInterval(interval);
      }
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [data, refetch]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-6xl mt-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscribed Instruments</h1>
          <div className="flex space-x-2">
            <Button onClick={performHealthCheck} disabled={isHealthChecking} color="light" size="sm">
              <HiRefresh className={`mr-2 h-4 w-4 ${isHealthChecking ? "animate-spin" : ""}`} />
              {isHealthChecking ? "Checking..." : "Check Worker Health"}
            </Button>
            <Button onClick={() => refetch()} color="light" size="sm">
              Refresh Data
            </Button>
          </div>
        </div>
        {data ? (
          <InstrumentTable instruments={data.data} onDelete={handleDelete} deletingRowIds={deletingRowIds} />
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
