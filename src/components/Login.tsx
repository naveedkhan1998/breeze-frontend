import  { ChangeEvent, FormEvent, useState } from "react";
import { Button, TextInput, Label } from "flowbite-react";
import { useLoginUserMutation } from "../services/userAuthService";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/authSlice";
import { storeToken } from "../services/LocalStorageService";
import { toast } from "react-toastify";
import { setToken } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { HiMail, HiLockClosed } from "react-icons/hi";

interface FormData {
  email: string;
  password: string;
}

interface Token {
  access: string;
  refresh: string;
}

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData).unwrap();
      const token: Token = res.token;
      setToken(token.access);
      storeToken({ value: { access: token.access } });
      dispatch(setCredentials({ access: token.access }));
      toast.success("Logged In Successfully");
      navigate("/"); // Navigate to home page after successful login
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <form className="flex flex-col w-full max-w-md gap-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="email" value="Email" className="block mb-2" />
        <TextInput id="email" type="email" icon={HiMail} placeholder="name@company.com" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="password" value="Password" className="block mb-2" />
        <TextInput id="password" type="password" icon={HiLockClosed} placeholder="••••••••" value={formData.password} onChange={handleChange} required />
      </div>
      <Button type="submit" className="mt-4">
        Log in
      </Button>
    </form>
  );
};

export default Login;
