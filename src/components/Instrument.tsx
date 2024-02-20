import { Button, Table } from "flowbite-react";
import {
  useGetInstrumentsQuery,
  useSubscribeInstrumentMutation,
} from "../services/instrumentService";
import { Instrument as InstrumentType } from "../common-types";
import { HiPlus } from "react-icons/hi";

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
    <div className="w-[95dvw] dark:bg-gray-900 overflow-auto max-h-[65dvh]">
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
              <Table.Row
                key={instrument.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className=" font-small text-ellipsis text-gray-900 dark:text-white">
                  {instrument.company_name}
                </Table.Cell>
                <Table.Cell>{instrument.series}</Table.Cell>
                <Table.Cell>{instrument.short_name}</Table.Cell>
                <Table.Cell>
                  <Button
                    pill
                    outline
                    gradientDuoTone="cyanToBlue"
                    onClick={() => handleClick(instrument.id)}
                  >
                    <HiPlus />
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
