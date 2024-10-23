import Link from "next/link";
import Weather from "../components/Weather";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
            Panda Express POS
          </h1>

          <div className="flex items-center space-x-6">
            <Link href="/manager">
              <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
                Manager
              </button>
            </Link>

            <div className="w-48">
              <Weather />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the POS System
        </h2>
        <p className="text-lg text-gray-600 max-w-lg text-center">
          Efficiently manage orders, inventory, and reports with our streamlined system.
        </p>
      </main>
    </div>
  );
}
