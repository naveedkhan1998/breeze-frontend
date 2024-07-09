import { Button, Checkbox, Label } from "flowbite-react";
import { FloatingLabel } from "flowbite-react";
import { useAppDispatch } from "../app/hooks";
import { useRegisterUserMutation } from "../services/userAuthService";
import { ChangeEvent, FormEvent, useState } from "react";
import { storeToken } from "../services/LocalStorageService";
import { setCredentials } from "../features/authSlice";
import { toast } from "react-toastify";
import { setToken } from "../services/auth";

interface FormData {
  name: string;
  email: string;
  password: string;
  password2: string;
  tc: boolean;
}

interface Token {
  access: string;
  refresh: string;
}

const Registration = () => {
  const dispatch = useAppDispatch();
  const [registerUser, isSuccess] = useRegisterUserMutation();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    password2: "",
    tc: true,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;

    // Convert string value to boolean if the input type is checkbox
    const newValue = type === "checkbox" ? value === "true" : value;

    setFormData((prevData) => ({ ...prevData, [id]: newValue }));
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      // Display an error message or take appropriate action
      toast.error("Passwords do not match");
      return;
    }
    const res = await registerUser(formData);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 justify-center w-[80dvw] sm:w-[50dvw] min-h-[70dvh]">
      <div>
        <FloatingLabel variant="standard" label="Full Name" id="name" type="text" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <FloatingLabel variant="standard" label="Email" id="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <FloatingLabel variant="standard" label="Password" id="password" type="password" value={formData.password} onChange={handleChange} required />
      </div>
      <div>
        <FloatingLabel variant="standard" label="Repeat Password" id="password2" type="password" value={formData.password2} onChange={handleChange} required />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="tc" value={formData.tc ? "true" : "false"} onChange={handleChange} required />
        <Label htmlFor="agree" className="flex">
          I agree with the&nbsp;
          <a href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
            terms and conditions
          </a>
        </Label>
      </div>
      <Button type="submit">Register new account</Button>
    </form>
  );
};

export default Registration;
