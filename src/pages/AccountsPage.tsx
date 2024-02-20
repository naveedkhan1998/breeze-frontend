import { ChangeEvent, useEffect, useState } from "react";
import {
  useGetBreezeQuery,
  useUpdateBreezeMutation,
} from "../services/breezeServices";
import { BreezeAccount } from "../common-types";
import { Button, Card, FloatingLabel, Modal } from "flowbite-react";
import { toast } from "react-toastify";

const AccountsPage = () => {
  const { data, isSuccess, refetch } = useGetBreezeQuery("");
  const [lastUpdatedHours, setLastUpdatedHours] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchData, setSearchData] = useState({
    sessionToken: "",
  });
  const [updateBreeze] = useUpdateBreezeMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleOpenLink = (key: string) => {
    window.open(
      `https://api.icicidirect.com/apiuser/login?api_key=${key}`,
      "_blank"
    );
  };

  const sendToken = (obj: BreezeAccount) => {
    const updatedObj = { ...obj };
    updatedObj.session_token = searchData.sessionToken;
    updateBreeze({ data: updatedObj });
    toast("Updated");
    refetch();
    setOpenModal(false);
  };

  useEffect(() => {
    if (isSuccess && data.data.length > 0) {
      const lastUpdatedTime = new Date(data.data[0].last_updated);

      const currentTime: Date = new Date();

      // Ensure both dates are in UTC to avoid time zone discrepancies
      lastUpdatedTime.setMinutes(
        lastUpdatedTime.getMinutes() - lastUpdatedTime.getTimezoneOffset()
      );
      currentTime.setMinutes(
        currentTime.getMinutes() - currentTime.getTimezoneOffset()
      );

      const timeDifferenceInMilliseconds =
        currentTime.getTime() - lastUpdatedTime.getTime();
      const timeDifferenceInHours =
        timeDifferenceInMilliseconds / (1000 * 60 * 60);

      setLastUpdatedHours(timeDifferenceInHours);
    }
  }, [isSuccess]);

  return (
    <div className="dark:bg-gray-900 h-[94.5dvh] items-baseline justify-around grid p-10">
      {data && (
        <>
          {data.data.map((item: BreezeAccount) => (
            <Card
              key={item.id}
              className="w-[60dvw] bg-white dark:bg-gray-800 shadow-md rounded-md p-4 space-y-4"
            >
              <h5 className="text-2xl font-serif font-bold tracking-tight text-gray-900 dark:text-white">
                Account Name: {item.name}
              </h5>
              <p className="font-normal text-gray-800 dark:text-gray-400">
                Session Token: {item.session_token}
              </p>
              <p className="font-normal text-gray-800 dark:text-gray-400">
                Last Updated:{" "}
                {lastUpdatedHours !== null
                  ? `${lastUpdatedHours.toFixed(1)} hours ago`
                  : "N/A"}
              </p>
              <p className="font-normal text-gray-800 dark:text-gray-400">
                Is Active: {item.is_active ? "True" : "False"}
              </p>
              <Button className="mt-4" onClick={() => setOpenModal(true)}>
                Update
              </Button>
              <Modal
                dismissible
                show={openModal}
                onClose={() => setOpenModal(false)}
              >
                <Modal.Header>
                  Instructions to Updated the Session Token
                </Modal.Header>
                <Modal.Body>
                  <div className="space-y-6">
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                      Click the link below to go to the ICICI Breeze login page.
                      Once there, follow the login steps and retrieve the
                      session token from the URL. Paste the token into the form
                      here.
                    </p>
                    <Button
                      outline
                      gradientDuoTone="cyanToBlue"
                      onClick={() => handleOpenLink(item.api_key)}
                    >
                      ICICI BREEZE
                    </Button>

                    <FloatingLabel
                      className=" "
                      variant="standard"
                      label="Session Token"
                      id="sessionToken"
                      type="text"
                      value={searchData.sessionToken}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => sendToken(item)}>Update Token</Button>
                  <Button color="gray" onClick={() => setOpenModal(false)}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default AccountsPage;
