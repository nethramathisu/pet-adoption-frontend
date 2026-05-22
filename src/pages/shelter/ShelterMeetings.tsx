import { useEffect, useState } from "react";
import API from "../../services/api";

interface Meeting {
  _id: string;
  meetingDate: string;
  note: string;
  status: string;
  pet: {
    name: string;
    images: string[];
  };
  user: {
    name: string;
    email: string;
  };
}

const ShelterMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const fetchMeetings = async () => {
    try {
      const res = await API.get("/meetings/shelter");
      setMeetings(res.data);
    }catch(err:any) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await API.put(`/meetings/${id}`, { status });
      fetchMeetings();
    }catch(err:any) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        📅 Meeting Requests
      </h1>

      <div className="space-y-6">
        {meetings.map((m) => (
          <div
            key={m._id}
            className="bg-white shadow-xl rounded-xl p-6 flex gap-6"
          >
            <img
              src={m.pet?.images?.[0]}
              className="w-28 h-28 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {m.pet?.name}
              </h2>

              <p className="text-gray-600">
                👤 {m.user?.name} ({m.user?.email})
              </p>

              <p className="text-gray-500 mt-1">
                📅 {new Date(m.meetingDate).toLocaleString()}
              </p>

              <p className="mt-2 text-gray-700">
                📝 {m.note}
              </p>

              <div className="mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    m.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : m.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() =>
                    updateStatus(m._id, "approved")
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(m._id, "rejected")
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShelterMeetings;