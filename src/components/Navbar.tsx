import { Avatar, Dropdown, Navbar as FlowbiteNavbar } from "flowbite-react";
import { removeToken } from "../services/LocalStorageService";
import { logOut } from "../features/authSlice";
import { toast } from "react-toastify";
import { DarkThemeToggle } from "flowbite-react";
import { Link } from "react-router-dom";
import { setMode } from "../features/darkModeSlice";
import { useAppDispatch } from "../app/hooks";
const Navbar = () => {
  const dispatch = useAppDispatch();
  const signOut = () => {
    removeToken();
    dispatch(logOut());
    toast.success("Logged Out");
  };

  const handleClick = () => {
    console.log(localStorage.getItem("flowbite-theme-mode"));

    setTimeout(() => {
      dispatch(setMode());
    }, 5);
  };

  return (
    <FlowbiteNavbar
      fluid
      className="sticky top-0 z-30 shadow-2xl dark:shadow-white/10"
    >
      <FlowbiteNavbar.Brand href="#">
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          ICICI Breeze
        </span>
      </FlowbiteNavbar.Brand>
      <div className="flex md:order-2">
        <DarkThemeToggle onClickCapture={handleClick} className="mr-2 " />
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
            <span className="block text-sm font-medium truncate">
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
        <FlowbiteNavbar.Link
          as={Link}
          to="/"
          className="transition-colors delay-200 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-500"
        >
          Home
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link
          as={Link}
          to="/instruments"
          className="transition-colors delay-200 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-500"
        >
          Instruments
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link
          as={Link}
          to="/accounts"
          className="transition-colors delay-200 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-500"
        >
          Accounts
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link
          as={Link}
          to="/about"
          className="transition-colors delay-200 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-500"
        >
          About
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link
          as={Link}
          to="/contact"
          className="transition-colors delay-200 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-500"
        >
          Contact
        </FlowbiteNavbar.Link>
      </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>
  );
};

export default Navbar;
