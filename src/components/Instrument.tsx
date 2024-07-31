import { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { useGetInstrumentsQuery, useGetSubscribedInstrumentsQuery, useSubscribeInstrumentMutation } from "../services/instrumentService";
import { Instrument as InstrumentType } from "../common-types";
import { HiPlus } from "react-icons/hi";
import { toast } from "react-toastify";

type Props = {
  exchange: string;
  searchTerm: string;
};

interface InstrumentItemProps {
  instrument: InstrumentType;
  onSubscribe: (id: number) => void;
  isSubscribing: boolean;
}

const InstrumentItem: React.FC<InstrumentItemProps> = ({ instrument, onSubscribe, isSubscribing }) => (
  <div className="flex flex-col items-start justify-between p-4 transition-colors duration-150 ease-in-out border-b border-gray-200 sm:flex-row sm:items-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
    <div className="flex-grow mb-3 sm:mb-0">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{instrument.exchange_code}</h3>
      <div className="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
        <p>
          <span className="font-semibold">Symbol:</span> {instrument.stock_token || instrument.token} |<span className="ml-2 font-semibold">Series:</span> {instrument.series}
        </p>
        <p>
          <span className="font-semibold">Exchange:</span> {instrument.exchange_code} |<span className="ml-2 font-semibold">Expiry:</span> {instrument.expiry || "N/A"}
        </p>
        {instrument.strike_price !== null && instrument.option_type && (
          <p>
            <span className="font-semibold">Strike:</span> {instrument.strike_price} |<span className="ml-2 font-semibold">Type:</span> {instrument.option_type}
          </p>
        )}
        <span className="font-semibold">Company Name:</span> <span>{instrument.company_name}</span>
      </div>
    </div>
    <Button size="sm" outline gradientDuoTone="cyanToBlue" onClick={() => onSubscribe(instrument.id)} disabled={isSubscribing}>
      {isSubscribing ? (
        <Spinner size="sm" />
      ) : (
        <>
          <HiPlus className="w-4 h-4 mr-2" />
          Subscribe
        </>
      )}
    </Button>
  </div>
);

const Instrument = ({ exchange, searchTerm }: Props) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [subscribeInstrument] = useSubscribeInstrumentMutation();
  const { refetch } = useGetSubscribedInstrumentsQuery("");
  const [subscribingIds, setSubscribingIds] = useState<number[]>([]);

  const { data, isLoading, isError } = useGetInstrumentsQuery(
    {
      exchange,
      search: debouncedSearchTerm,
    },
    {
      skip: debouncedSearchTerm.length < 3,
    }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubscribe = async (id: number) => {
    setSubscribingIds((prev) => [...prev, id]);
    try {
      await subscribeInstrument({ id }).unwrap();
      await refetch();
      toast.success("Instrument Subscribed");
    } catch (error) {
      toast.error("Failed to subscribe to instrument");
    } finally {
      setSubscribingIds((prev) => prev.filter((subId) => subId !== id));
    }
  };

  if (isLoading) {
    return <Spinner size="xl" className="m-auto" />;
  }

  if (isError) {
    return <div className="text-red-500">Error loading instruments</div>;
  }

  return (
    <div className="container px-4 mx-auto">
      <div className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        {data &&
          data.data?.map((instrument: InstrumentType) => (
            <InstrumentItem key={instrument.id} instrument={instrument} onSubscribe={handleSubscribe} isSubscribing={subscribingIds.includes(instrument.id)} />
          ))}
      </div>
      {!data && <p className="mt-4 text-center text-gray-500 dark:text-gray-400">No instruments found. Try adjusting your search.</p>}
    </div>
  );
};

export default Instrument;
