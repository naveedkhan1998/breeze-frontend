
import { Tabs, Card } from "flowbite-react";
import { HiUser, HiUserAdd } from "react-icons/hi";
import Login from "../components/Login";
import Registration from "../components/Registration";

const LoginRegPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-2xl shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-white">Welcome to ICICI Breeze</h2>
        <Tabs aria-label="Login and Registration tabs" style="underline" className="w-full">
          <Tabs.Item active title="Login" icon={HiUser}>
            <Login />
          </Tabs.Item>
          <Tabs.Item title="Registration" icon={HiUserAdd}>
            <Registration />
          </Tabs.Item>
        </Tabs>
      </Card>
    </div>
  );
};

export default LoginRegPage;
