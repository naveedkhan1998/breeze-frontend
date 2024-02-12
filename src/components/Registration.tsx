import { Button, Checkbox, Label } from "flowbite-react";
import { FloatingLabel } from "flowbite-react";
const Registration = () => {
  return (
    <div className="h-[60dvh]">
      <form className="flex flex-col gap-6 w-[50dvw] justify-center h-[50dvh]">
        <div>
          <FloatingLabel
            variant="standard"
            label="Email"
            id="email"
            type="email"
            required
          />
        </div>
        <div>
          <FloatingLabel
            variant="standard"
            label="Password"
            id="password1"
            type="password"
            required
          />
        </div>
        <div>
          <FloatingLabel
            variant="standard"
            label="Repeat Password"
            id="password2"
            type="password"
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="agree" />
          <Label htmlFor="agree" className="flex">
            I agree with the&nbsp;
            <a
              href="#"
              className="text-cyan-600 hover:underline dark:text-cyan-500"
            >
              terms and conditions
            </a>
          </Label>
        </div>
        <Button type="submit">Register new account</Button>
      </form>
    </div>
  );
};

export default Registration;
