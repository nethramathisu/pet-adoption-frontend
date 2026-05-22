import { Link } from "react-router-dom";

const ShelterDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto py-8">

      {/* TITLE */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          🏠 Shelter Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage pets, applications,
          foster pets, and chats.
        </p>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* PETS */}
        <Link
          to="/shelter/pets"
          className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition"
        >

          <div className="text-5xl mb-4">
            🐶
          </div>

          <h2 className="text-2xl font-bold">
            Manage Pets
          </h2>

          <p className="text-gray-500 mt-2">
            Add, edit, delete pets
          </p>

        </Link>

        {/* APPLICATIONS */}
        <Link
          to="/shelter/applications"
          className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition"
        >

          <div className="text-5xl mb-4">
            📄
          </div>

          <h2 className="text-2xl font-bold">
            Applications
          </h2>

          <p className="text-gray-500 mt-2">
            Review adoption requests
          </p>

        </Link>

        {/* INBOX */}
        <Link
          to="/app/inbox"
          className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition"
        >

          <div className="text-5xl mb-4">
            💬
          </div>

          <h2 className="text-2xl font-bold">
            Messages
          </h2>

          <p className="text-gray-500 mt-2">
            Chat with adopters
          </p>

        </Link>

      </div>

    </div>
  );
};

export default ShelterDashboard;