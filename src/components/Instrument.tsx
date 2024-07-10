import { useEffect, useState } from "react";
import { Button, Table, Spinner } from "flowbite-react";
import { useGetInstrumentsQuery, useGetSubscribedInstrumentsQuery, useSubscribeInstrumentMutation } from "../services/instrumentService";
import { Instrument as InstrumentType } from "../common-types";
import { HiPlus } from "react-icons/hi";
import { toast } from "react-toastify";

type Props = {
  exchange: string;
  searchTerm: string;
};

const Instrument = ({ exchange, searchTerm }: Props) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [subscribeInstrument] = useSubscribeInstrumentMutation();
  const { refetch } = useGetSubscribedInstrumentsQuery("");

  const { data, isLoading, isError } = useGetInstrumentsQuery(
    {
      exchange,
      search: debouncedSearchTerm,
    },
    {
      skip: debouncedSearchTerm.length < 3, // Skip query if search term is too short
    }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleClick = async (id: number) => {
    try {
      await subscribeInstrument({ id }).unwrap();
      await refetch();
      toast.success("Instrument Subscribed");
    } catch (error) {
      toast.error("Failed to subscribe to instrument");
    }
  };

  if (isLoading) {
    return <Spinner size="xl" className="m-auto" />;
  }

  if (isError) {
    return <div className="text-red-500">Error loading instruments</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table striped hoverable>
        <Table.Head>
          <Table.HeadCell>Company Name</Table.HeadCell>
          <Table.HeadCell>Series</Table.HeadCell>
          <Table.HeadCell>Short Name</Table.HeadCell>
          <Table.HeadCell>Subscribe</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data &&
            data.data?.map((instrument: InstrumentType) => (
              <Table.Row key={instrument.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="font-medium text-gray-900 dark:text-white">{instrument.company_name}</Table.Cell>
                <Table.Cell>{instrument.series}</Table.Cell>
                <Table.Cell>{instrument.short_name}</Table.Cell>
                <Table.Cell>
                  <Button size="sm" pill outline gradientDuoTone="cyanToBlue" onClick={() => handleClick(instrument.id)}>
                    <HiPlus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Subscribe</span>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Instrument;
