import { useAppSelector } from "./app/hooks";
import Navbar from "./components/Navbar";
import Toast from "./components/ToastContainer";
import { getCurrentToken } from "./features/authSlice";
import AboutPage from "./pages/AboutPage";
import AccountsPage from "./pages/AccountsPage";
import ContactPage from "./pages/ContactPage";
import GraphsPage from "./pages/GraphsPage";
import HomePage from "./pages/HomePage";
import InstrumentsPage from "./pages/InstrumentsPage";
import LoginRegPage from "./pages/LoginRegPage";
import { Flowbite } from "flowbite-react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, ReactElement } from "react";
import { useHealthCheckQuery } from "./services/baseApi";
import LoadingScreen from "./components/LoadingScreen";
import NotFoundPage from "./pages/NotFoundPage";

// Define the props for PrivateRoute
interface PrivateRouteProps {
  element: ReactElement;
}

// PrivateRoute component to protect routes
const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const access_token = useAppSelector(getCurrentToken);
  return access_token ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  // Perform the initial health check
  const { isLoading, refetch } = useHealthCheckQuery("");

  useEffect(() => {
    const checkEnvironment = () => {
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      localStorage.setItem("isLocalhost", JSON.stringify(isLocalhost));
    };

    checkEnvironment();
  }, []);

  useEffect(() => {
    // Set up a recurring health check every 2 minutes
    const intervalId = setInterval(() => {
      refetch();
    }, 120000); // 120000 ms = 2 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [refetch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Flowbite>
        <Navbar />
        <Routes>
          <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
          <Route path="/about" element={<PrivateRoute element={<AboutPage />} />} />
          <Route path="/instruments" element={<PrivateRoute element={<InstrumentsPage />} />} />
          <Route path="/graphs/:id" element={<PrivateRoute element={<GraphsPage />} />} />
          <Route path="/accounts" element={<PrivateRoute element={<AccountsPage />} />} />
          <Route path="/contact" element={<PrivateRoute element={<ContactPage />} />} />
          <Route path="/login" element={<LoginRegPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toast />
      </Flowbite>
    </BrowserRouter>
  );
};

export default App;
