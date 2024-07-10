import { ChangeEvent, useEffect, useState } from "react";
import { useGetBreezeQuery, useUpdateBreezeMutation } from "../services/breezeServices";
import { BreezeAccount } from "../common-types";
import { Button, Card, Modal, Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import CreateBreezeForm from "../components/CreateBreeze";

const AccountsPage = () => {
  const { data, isSuccess, refetch } = useGetBreezeQuery("");
  const [lastUpdatedHours, setLastUpdatedHours] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BreezeAccount | null>(null);
  const [sessionToken, setSessionToken] = useState("");

  const [updateBreeze] = useUpdateBreezeMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSessionToken(e.target.value);
  };

  const handleOpenLink = (key: string) => {
    window.open(`https://api.icicidirect.com/apiuser/login?api_key=${key}`, "_blank");
  };

  const sendToken = async () => {
    if (selectedAccount) {
      const updatedAccount = { ...selectedAccount, session_token: sessionToken };
      try {
        await updateBreeze({ data: updatedAccount });
        toast.success("Session token updated successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to update session token");
      }
      setOpenModal(false);
    }
  };

  useEffect(() => {
    if (isSuccess && data.data.length > 0) {
      const lastUpdatedTime = new Date(data.data[0].last_updated);
      const currentTime = new Date();

      lastUpdatedTime.setMinutes(lastUpdatedTime.getMinutes() - lastUpdatedTime.getTimezoneOffset());
      currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());

      const timeDifferenceInMilliseconds = currentTime.getTime() - lastUpdatedTime.getTime();
      const timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

      setLastUpdatedHours(timeDifferenceInHours);
    }
  }, [isSuccess, data]);

  if (!isSuccess) {
    return <CreateBreezeForm />;
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      {data ? (
        data.data.map((account: BreezeAccount) => (
          <Card key={account.id} className="w-full max-w-4xl p-4 mt-8 mb-8 space-y-4 bg-white rounded-md shadow-md dark:bg-gray-800">
            <h5 className="text-2xl font-bold text-gray-900 dark:text-white">Account Name: {account.name}</h5>
            <p className="text-gray-800 dark:text-gray-400">Session Token: {account.session_token}</p>
            <p className="text-gray-800 dark:text-gray-400">Last Updated: {lastUpdatedHours !== null ? `${lastUpdatedHours.toFixed(1)} hours ago` : "N/A"}</p>
            <p className="text-gray-800 dark:text-gray-400">Is Active: {account.is_active ? "True" : "False"}</p>
            <Button
              size="sm"
              gradientDuoTone="pinkToOrange"
              onClick={() => {
                setSelectedAccount(account);
                setOpenModal(true);
              }}
            >
              Update Session Token
            </Button>
          </Card>
        ))
      ) : (
        <div className="flex items-center justify-center h-64">
          <Spinner size="xl" />
        </div>
      )}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Update Session Token</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-gray-500 dark:text-gray-400">
              Click the link below to go to the ICICI Breeze login page. Once there, follow the login steps and retrieve the session token from the URL. Paste the token into the form here.
            </p>
            <Button outline gradientDuoTone="cyanToBlue" onClick={() => handleOpenLink(selectedAccount?.api_key || "")}>
              ICICI BREEZE
            </Button>
            <input
              type="text"
              id="sessionToken"
              className="block w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Session Token"
              value={sessionToken}
              onChange={handleChange}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={sendToken}>Update Token</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AccountsPage;
