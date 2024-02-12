import { Tabs } from "flowbite-react";
import { HiUser, HiBookOpen } from "react-icons/hi";
import Login from "../components/Login";
import Registration from "../components/Registration";
//import { MdDashboard } from "react-icons/md";
const LoginRegPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] pt-12 dark:bg-black/80 ">
      <Tabs
        aria-label="Full width tabs"
        style="underline"
        className="w-[85dvw] shadow-2xl rounded-md items-center justify-center  "
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
