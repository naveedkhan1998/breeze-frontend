import { Button, Table } from "flowbite-react";
import {
  useGetInstrumentsQuery,
  useSubscribeInstrumentMutation,
} from "../services/instrumentService";
import { Instrument as InstrumentType } from "../common-types";

type Props = {
  exchange: string;
  searchTerm: string;
};

const Instrument = ({ exchange, searchTerm }: Props) => {
  const exc = exchange;
  const search = searchTerm;
  const [subscribeInstrument] = useSubscribeInstrumentMutation();

  const { data } = useGetInstrumentsQuery({
    exchange: exc,
    search: search,
  });

  const handleClick = (id: number) => {
    subscribeInstrument({ id: id });
    //console.log(id);
  };

  return (
    <div className=" w-[70dvw]">
      <Table striped hoverable>
        <Table.Head>
          <Table.HeadCell>Company Name</Table.HeadCell>
          <Table.HeadCell>Token</Table.HeadCell>
          <Table.HeadCell>Instrument</Table.HeadCell>
          <Table.HeadCell>Short Name</Table.HeadCell>
          <Table.HeadCell>Subscribe</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data &&
            data.data?.map((instrument: InstrumentType) => (
              <Table.Row
                key={instrument.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {instrument.company_name}
                </Table.Cell>
                <Table.Cell>{instrument.token}</Table.Cell>
                <Table.Cell>{instrument.company_name}</Table.Cell>
                <Table.Cell>{instrument.short_name}</Table.Cell>
                <Table.Cell>
                  <Button pill outline gradientDuoTone="purpleToBlue" onClick={() => handleClick(instrument.id)}>+</Button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Instrument;
