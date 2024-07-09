import { Button } from "flowbite-react";
import { FloatingLabel } from "flowbite-react";
import { useLoginUserMutation } from "../services/userAuthService";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/authSlice";
import { storeToken } from "../services/LocalStorageService";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { setToken } from "../services/auth";

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
  const [loginUser, isSuccess] = useLoginUserMutation();

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

    const res = await loginUser(formData);
    if (isSuccess) {
      if ("data" in res) {
        const token: Token = res.data.token;
        setToken(token.access);
        storeToken({ value: { access: token.access } });
        dispatch(setCredentials({ access: token.access }));
        toast.success("Logged In");
      } else if ("error" in res) {
        toast.error(JSON.stringify(res.error));
      }
    }
  };
  return (
    <form className="flex flex-col gap-6  justify-center w-[80dvw] sm:w-[50dvw] min-h-[70dvh]" onSubmit={handleSubmit}>
      <div>
        <FloatingLabel variant="standard" label="Email" id="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <FloatingLabel variant="standard" label="Password" id="password" type="password" value={formData.password} onChange={handleChange} required />
      </div>

      <Button type="submit">Login</Button>
    </form>
  );
};

export default Login;
