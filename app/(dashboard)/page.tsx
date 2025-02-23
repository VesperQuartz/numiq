import Link from "next/link";

const HomePage = async () => {
  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-7rem)]">
      <div className="max-w-4xl w-full space-y-8 bg-white bg-opacity-10 rounded-xl shadow-2xl overflow-hidden text-center backdrop-blur-md">
        <div className="bg-indigo-600 bg-opacity-75 p-6">
          <h2 className="text-3xl font-bold text-white">Welcome to NumiQ</h2>
        </div>
        <div className="p-8 space-y-6">
          <p className="text-xl text-gray-200">
            Improve your math skills and compete with others!
          </p>
          <Link
            href="/practice"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Start Practicing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
