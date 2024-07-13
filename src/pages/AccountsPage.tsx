import { ChangeEvent, useEffect, useState } from "react";
import { useGetBreezeQuery, useLazySetupQuery, useUpdateBreezeMutation } from "../services/breezeServices";
import { BreezeAccount } from "../common-types";
import { Button, Card, Modal, Spinner, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import CreateBreezeForm from "../components/CreateBreeze";
import { FaSync, FaExternalLinkAlt } from "react-icons/fa";

const AccountsPage = () => {
  const { data, isSuccess, refetch, isLoading } = useGetBreezeQuery("");
  const [lastUpdatedHours, setLastUpdatedHours] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BreezeAccount | null>(null);
  const [sessionToken, setSessionToken] = useState("");

  const [updateBreeze, { isLoading: isUpdating }] = useUpdateBreezeMutation();
  const [triggerSetup, { isLoading: isSetupLoading }] = useLazySetupQuery();

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
        setOpenModal(false);
        setSessionToken("");
      } catch (error) {
        toast.error("Failed to update session token");
      }
    }
  };

  const handleSetup = async () => {
    try {
      await triggerSetup("");
      toast.success("Setup completed successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to complete setup");
    }
  };

  useEffect(() => {
    if (isSuccess && data.data.length > 0) {
      const lastUpdatedTime = new Date(data.data[0].last_updated);
      const currentTime = new Date();
      const timeDifferenceInHours = (currentTime.getTime() - lastUpdatedTime.getTime()) / (1000 * 60 * 60);
      setLastUpdatedHours(timeDifferenceInHours);
    }
  }, [isSuccess, data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!isSuccess || !data || data.data.length === 0) {
    return <CreateBreezeForm />;
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center text-gray-800 dark:text-white">Breeze Accounts</h1>
      <div className="flex justify-end mb-4">
        <Button gradientDuoTone="greenToBlue" onClick={handleSetup} disabled={isSetupLoading}>
          {isSetupLoading ? <Spinner size="sm" /> : "Setup"}
        </Button>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((account: BreezeAccount) => (
          <Card key={account.id} className="transition-shadow duration-300 hover:shadow-lg">
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">{account.name}</h5>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Session Token:</span> {account.session_token ? "••••••" : "Not set"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Last Updated:</span> {lastUpdatedHours !== null ? `${lastUpdatedHours.toFixed(1)} hours ago` : "N/A"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Status:</span> <span className={`font-bold ${account.is_active ? "text-green-600" : "text-red-600"}`}>{account.is_active ? "Active" : "Inactive"}</span>
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <Button
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={() => {
                  setSelectedAccount(account);
                  setOpenModal(true);
                }}
              >
                <FaSync className="mr-2" /> Update Token
              </Button>
              <Button size="sm" color="light" onClick={() => handleOpenLink(account.api_key)}>
                <FaExternalLinkAlt className="mr-2" /> ICICI Breeze
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Update Session Token</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400">
              Click the link below to go to the ICICI Breeze login page. Once there, follow the login steps and retrieve the session token from the URL. Paste the token into the form here.
            </p>
            <Button outline gradientDuoTone="cyanToBlue" onClick={() => handleOpenLink(selectedAccount?.api_key || "")}>
              <FaExternalLinkAlt className="mr-2" /> Open ICICI BREEZE
            </Button>
            <TextInput id="sessionToken" type="text" placeholder="Enter Session Token" value={sessionToken} onChange={handleChange} required />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button gradientDuoTone="greenToBlue" onClick={sendToken} disabled={isUpdating}>
            {isUpdating ? <Spinner size="sm" /> : "Update Token"}
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AccountsPage;
