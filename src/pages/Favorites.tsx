import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getFavorites } from "../services/favoriteService";

interface Pet {
  _id: string;
  name: string;
  breed: string;
  age: number;
  size: string;
  location: string;
  images: string[];
}

const Favorites = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavorites();

        setPets(data);
      } catch (err:any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading favorites... ❤️
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">
        ❤️ My Favorite Pets
      </h1>

      {/* EMPTY STATE */}
      {pets.length === 0 && (
        <div className="bg-white shadow rounded-xl p-8 text-center text-gray-500">
          No favorite pets yet.
        </div>
      )}

      {/* PET GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {pets.map((pet) => (
          <div
            key={pet._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
          >

            {/* IMAGE */}
            <img
              src={
                pet.images?.[0] ||
                "https://via.placeholder.com/300"
              }
              className="h-52 w-full object-cover"
            />

            {/* CONTENT */}
            <div className="p-4 space-y-2">

              <h2 className="text-xl font-semibold">
                {pet.name}
              </h2>

              <p className="text-gray-600">
                {pet.breed}
              </p>

              <div className="text-sm text-gray-500">
                Age: {pet.age} yrs | Size: {pet.size}
              </div>

              <div className="text-sm text-gray-400">
                📍 {pet.location}
              </div>

              {/* BUTTON */}
              <button
                onClick={() =>
                  navigate(`/pet/${pet._id}`)
                }
                className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                View Details
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Favorites;