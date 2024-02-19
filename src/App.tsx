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
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const access_token = useAppSelector(getCurrentToken);
  return (
    <BrowserRouter>
      <Flowbite>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={access_token ? <HomePage /> : <LoginRegPage />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/instruments" element={<InstrumentsPage />} />
          <Route path="/graphs/:id" element={<GraphsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Toast />
      </Flowbite>
    </BrowserRouter>
  );
};

export default App;
