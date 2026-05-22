import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";

interface Application {
  _id: string;
  message: string;
  status: string;
  responseMessage?: string;

  pet: {
    _id: string;
    name: string;
    breed: string;
    images: string[];
  };
}

const MyApplications = () => {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchApplications =
      async () => {
        try {
          const data =
            await getMyApplications();

          setApplications(data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">
        📄 My Applications
      </h1>

      {/* EMPTY */}
      {applications.length === 0 && (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No applications yet.
        </div>
      )}

      {/* APPLICATIONS */}
      <div className="space-y-6">

        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden"
          >

            <div className="md:flex">

              {/* IMAGE */}
              <img
                src={
                  app.pet?.images?.[0] ||
                  "https://via.placeholder.com/300"
                }
                className="w-full md:w-64 h-64 object-cover"
              />

              {/* CONTENT */}
              <div className="p-6 flex-1 space-y-4">

                {/* PET INFO */}
                <div>
                  <h2 className="text-2xl font-bold">
                    {app.pet?.name}
                  </h2>

                  <p className="text-gray-600">
                    {app.pet?.breed}
                  </p>
                </div>

                {/* USER MESSAGE */}
                <div>
                  <h3 className="font-semibold">
                    Your Application
                  </h3>

                  <p className="text-gray-600">
                    {app.message}
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  <span className="font-semibold">
                    Status:
                  </span>

                  <span
                    className={`ml-3 px-3 py-1 rounded-full text-white text-sm ${
                      app.status === "approved"
                        ? "bg-green-500"
                        : app.status === "rejected"
                        ? "bg-red-500"
                        : app.status ===
                          "info_requested"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* RESPONSE */}
                {app.responseMessage && (
                  <div className="bg-gray-100 p-4 rounded-xl">

                    <h3 className="font-semibold mb-1">
                      Shelter Response
                    </h3>

                    <p className="text-gray-700">
                      {app.responseMessage}
                    </p>

                  </div>
                )}

              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default MyApplications;