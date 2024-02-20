import { Card } from "flowbite-react";

const ContactPage = () => {
  return (
    <div className="dark:bg-gray-900 h-screen flex items-center justify-center">
      <div className="max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-md shadow-lg text-gray-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We'd love to hear from you! Whether you have a question, feedback, or
          a project idea, feel free to reach out to us using the contact details
          below or by filling out the form.
        </p>
        <div className="mt-10">
          <Card className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Contact Information
            </h2>
            <p className="mt-3 text-gray-700 dark:text-gray-400">
              <strong>Email:</strong> info@example.com
              <br />
              <strong>Phone:</strong> +1 (123) 456-7890
              <br />
              <strong>Address:</strong> 123 Main Street, City, Country
            </p>
          </Card>
          <Card>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Send us a Message
            </h2>
            <p className="mt-3 text-gray-700 dark:text-gray-400">
              Use the form below to send us a message, and we'll get back to you
              as soon as possible.
            </p>
            
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
