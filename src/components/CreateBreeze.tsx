import { useState, ChangeEvent, FormEvent } from "react";
import { useCreateBreezeMutation } from "../services/breezeServices";
import { Button, Card, Spinner, TextInput, Checkbox, Label } from "flowbite-react";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  api_key: string;
  api_secret: string;
  session_token?: string;
  is_active: boolean;
}

const CreateBreezeForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    api_key: "",
    api_secret: "",
    session_token: "",
    is_active: true,
  });

  const [createBreeze, { isLoading }] = useCreateBreezeMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createBreeze(formData).unwrap();
      toast.success("Breeze account created successfully!");
      setFormData({
        name: "",
        api_key: "",
        api_secret: "",
        session_token: "",
        is_active: true,
      });
    } catch (error) {
      toast.error("Failed to create breeze account.");
      console.error("Failed to create breeze account:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Create Breeze Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <TextInput type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Account Name" required />
          </div>
          <div>
            <TextInput type="text" name="api_key" value={formData.api_key} onChange={handleChange} placeholder="API Key" required />
          </div>
          <div>
            <TextInput type="password" name="api_secret" value={formData.api_secret} onChange={handleChange} placeholder="API Secret" required />
          </div>
          <div>
            <TextInput type="text" name="session_token" value={formData.session_token} onChange={handleChange} placeholder="Session Token (Optional)" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <Button type="submit" gradientDuoTone="purpleToPink" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : "Create Breeze Account"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateBreezeForm;
