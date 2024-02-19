import { FloatingLabel, Tabs } from "flowbite-react";
import { ChangeEvent, useState } from "react";
import Instrument from "../components/Instrument";

const InstrumentsPage = () => {
  const [searchData, setSearchData] = useState({
    searchTerm: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchData((prevData) => ({ ...prevData, [id]: value }));
  };

  return (
    <div className=" dark:bg-gray-900  h-[94.5dvh] p-8">
      <div className="flex flex-col items-center justify-center pt-10  rounded-xl">
        <div>
          {" "}
          <FloatingLabel
            className=" w-[70dvw]"
            variant="standard"
            label="Search"
            id="searchTerm"
            type="text"
            value={searchData.searchTerm}
            onChange={handleChange}
            required
          />
        </div>

        <Tabs aria-label="Default tabs" style="fullWidth">
          <Tabs.Item active title="NSE">
            <Instrument exchange="NSE" searchTerm={searchData.searchTerm} />
          </Tabs.Item>
          <Tabs.Item title="BSE">
            <Instrument exchange="BSE" searchTerm={searchData.searchTerm} />
          </Tabs.Item>
          <Tabs.Item title="NFO">
            <Instrument exchange="FON" searchTerm={searchData.searchTerm} />{" "}
            {/* FON is NFO in backend */}
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};

export default InstrumentsPage;
