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

const InstrumentItem = ({ instrument, onSubscribe, isSubscribing }: { instrument: InstrumentType; onSubscribe: (id: number) => void; isSubscribing: boolean }) => (
  <div className="flex flex-col items-start justify-between p-4 border-b border-gray-200 shadow-md md:flex-row md:items-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
    <div className="flex-grow mb-2 md:mb-0">
      <h5 className="text-lg font-semibold text-gray-900 dark:text-white">{instrument.company_name}</h5>
      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        <p>
          {instrument.short_name} | {instrument.series} | {instrument.stock_token}
        </p>
        <p>
          Exchange: {instrument.exchange_code} | Expiry: {instrument.expiry || "N/A"}
        </p>
        {instrument.strike_price !== undefined && instrument.option_type && (
          <p>
            Strike: {instrument.strike_price} | Type: {instrument.option_type}
          </p>
        )}
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
