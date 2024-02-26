import { Card } from "flowbite-react";

const AboutPage = () => {
  return (
    <div className="dark:bg-gray-900 h-screen flex flex-wrap items-center justify-center">
      <div className="max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-md shadow-lg text-gray-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-6">Welcome to my site.</h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          At mnaveedk, we're not just a team; we're a family of passionate
          individuals committed to pushing the boundaries of web development.
          Our dedication to innovation and excellence sets us apart.
        </p>
        <div className="mt-10">
          <Card className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              My Mission
            </h2>
            <p className="mt-3 text-gray-700 dark:text-gray-400">
              Striving to deliver cutting-edge web solutions that not only meet
              but exceed my clients' expectations. We're not just building
              websites; we're crafting digital experiences that leave a lasting
              impact.
            </p>
          </Card>
          <Card>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Why Choose Us?
            </h2>
            <p className="mt-3 text-gray-700 dark:text-gray-400">
              We stand out through a perfect blend of creativity and
              collaboration. Your ideas are not just heard; they are transformed
              into reality with precision and care, ensuring a seamless and
              memorable digital journey.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
