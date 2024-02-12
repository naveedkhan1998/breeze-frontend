import { Avatar, Dropdown, Navbar as FlowbiteNavbar } from "flowbite-react";
import { useDispatch } from "react-redux";
import { removeToken } from "../services/LocalStorageService";
import { logOut } from "../features/authSlice";
import { toast } from "react-toastify";
import { DarkThemeToggle } from "flowbite-react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const dispatch = useDispatch();
  const signOut = () => {
    removeToken();
    dispatch(logOut());
    toast.success("Logged Out");
  };

  return (
    <FlowbiteNavbar fluid className=" shadow-2xl">
      <FlowbiteNavbar.Brand href="#">
        <img
          src="/vite.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          ICICI Breeze
        </span>
      </FlowbiteNavbar.Brand>
      <div className="flex md:order-2">
        <DarkThemeToggle className=" mr-2" />
        <FlowbiteNavbar.Toggle />
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://ui-avatars.com/api/?name=Naveed+Khan"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Naveed Khan</span>
            <span className="block truncate text-sm font-medium">
              admin@gmail.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={signOut}>Sign out</Dropdown.Item>
        </Dropdown>
      </div>
      <FlowbiteNavbar.Collapse>
        <Link to="/" className=" dark:text-white hover:text-cyan-500 transition-colors delay-200" >Home</Link>
        <Link to="/instruments" className=" dark:text-white hover:text-cyan-500 transition-colors delay-200">Instruments</Link>
        <Link to="/graphs" className=" dark:text-white hover:text-cyan-500 transition-colors delay-200">Graphs</Link>
        <Link to="/about" className=" dark:text-white hover:text-cyan-500 transition-colors delay-200">About</Link>
        <Link to="/contact" className=" dark:text-white hover:text-cyan-500 transition-colors delay-200">Contact</Link>
      </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>
  );
};

export default Navbar;
