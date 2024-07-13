import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Spinner, Card } from "flowbite-react";
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

const InstrumentCard: React.FC<{
  instrument: Instrument;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}> = ({ instrument, onDelete, isDeleting }) => {
  const isLoading = instrument.percentage.some((p) => p.is_loading);

  return (
    <Card className="mb-4">
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{instrument.company_name}</h5>
      <div className="mb-4">
        {instrument.percentage.length > 0 ? (
          instrument.percentage.map((p, index) => (
            <div key={index} className="flex items-center mb-2 space-x-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${p.percentage}%` }}></div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{p.percentage.toFixed(2)}%</span>
              {!p.is_loading && <Spinner size="sm" />}
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">No data</span>
        )}
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Link to={`/graphs/${instrument.id}`} state={{ obj: instrument }} className="w-full sm:w-auto">
          <Button disabled={!isLoading} size="sm" gradientDuoTone="tealToLime" className="w-full">
            <HiChartBar className="w-4 h-4 mr-2" />
            View Graph
          </Button>
        </Link>
        <Button size="sm" gradientDuoTone="pinkToOrange" onClick={() => onDelete(instrument.id)} className="w-full sm:w-auto" disabled={isDeleting}>
          <HiTrash className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </Card>
  );
};

const getAveragePercentage = (instrument: Instrument): number => {
  if (instrument.percentage.length === 0) return 0;
  const sum = instrument.percentage.reduce((acc, curr) => acc + curr.percentage, 0);
  return sum / instrument.percentage.length;
};

const HomePage: React.FC = () => {
  const { data, refetch } = useGetSubscribedInstrumentsQuery("");
  const [deleteInstrument] = useDeleteInstrumentMutation();
  const [deletingRowIds, setDeletingRowIds] = useState<number[]>([]);
  const [isHealthChecking, setIsHealthChecking] = useState(false);

  const sortedInstruments = React.useMemo(() => {
    if (!data?.data) return [];
    return [...data.data].sort((a, b) => getAveragePercentage(b) - getAveragePercentage(a));
  }, [data]);

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
    <div className="flex flex-col items-center w-full min-h-screen p-2 bg-gray-100 md:p-4 dark:bg-gray-900">
      <div className="w-full max-w-6xl mt-4 mb-4 md:mt-8 md:mb-8">
        <Card>
          <div className="flex flex-col items-start justify-between mb-4 md:flex-row md:items-center md:mb-6">
            <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white md:mb-0">Subscribed Instruments</h1>
            <div className="flex flex-col w-full space-y-2 md:flex-row md:space-y-0 md:space-x-2 md:w-auto">
              <Button onClick={performHealthCheck} disabled={isHealthChecking} color="light" size="sm" className="w-full md:w-auto">
                <HiRefresh className={`mr-2 h-4 w-4 ${isHealthChecking ? "animate-spin" : ""}`} />
                {isHealthChecking ? "Checking..." : "Check Worker Health"}
              </Button>
              <Button onClick={() => refetch()} color="light" size="sm" className="w-full md:w-auto">
                Refresh Data
              </Button>
            </div>
          </div>
        </Card>

        {data ? (
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedInstruments.map((instrument: Instrument) => (
              <InstrumentCard key={instrument.id} instrument={instrument} onDelete={handleDelete} isDeleting={deletingRowIds.includes(instrument.id)} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <Spinner size="xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
