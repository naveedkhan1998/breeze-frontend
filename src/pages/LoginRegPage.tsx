import { Tabs } from "flowbite-react";
import { HiUser, HiBookOpen } from "react-icons/hi";
import Login from "../components/Login";
import Registration from "../components/Registration";
//import { MdDashboard } from "react-icons/md";
const LoginRegPage = () => {
  return (
    <div className="flex flex-col items-center justify-normal dark:bg-gray-900 h-[94.5dvh] p-6">
      <Tabs
        aria-label="Full width tabs"
        style="fullWidth"
        className="w-[90dvw] sm:w-[60dvw] shadow-2xl rounded-sm dark:bg-gray-700 justify-normal items-center"
      >
        <Tabs.Item active title="Login" icon={HiUser}>
          <Login />
        </Tabs.Item>
        <Tabs.Item title="Regitration" icon={HiBookOpen}>
          <Registration />
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default LoginRegPage;
