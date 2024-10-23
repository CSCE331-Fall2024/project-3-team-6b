import Weather from "../components/Weather";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between bg-white shadow-md p-4">
        <h1 className="text-2xl font-semibold">Panda Express POS System</h1>
        <div className="w-48">
          <Weather />
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <h2 className="text-3xl font-bold mb-6">Welcome to the POS System</h2>
      </main>
    </div>
  );
}
