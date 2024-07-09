import { useState, ChangeEvent, FormEvent } from "react";
import { useCreateBreezeMutation } from "../services/breezeServices";

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

  const [createBreeze, { isLoading, isSuccess, isError }] = useCreateBreezeMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      createBreeze(formData);
    } catch (error) {
      console.error("Failed to create breeze account:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-900 dark:text-white">Create Breeze Account</h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">API Key</label>
          <input
            type="text"
            name="api_key"
            value={formData.api_key}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">API Secret</label>
          <input
            type="text"
            name="api_secret"
            value={formData.api_secret}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Session Token</label>
          <input
            type="text"
            name="session_token"
            value={formData.session_token}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
          />
          <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-600"
        >
          {isLoading ? "Creating..." : "Create Breeze Account"}
        </button>

        {isSuccess && <p className="mt-4 text-sm text-center text-green-600 dark:text-green-400">Breeze account created successfully!</p>}
        {isError && <p className="mt-4 text-sm text-center text-red-600 dark:text-red-400">Failed to create breeze account.</p>}
      </form>
    </div>
  );
};

export default CreateBreezeForm;
