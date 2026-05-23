import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import StarRating from "../components/StarRating";

const PetReviews = () => {
  const { id } = useParams(); // 👈 get petId from URL

  const petId = id;

  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [avg, setAvg] = useState(0);

  const fetchReviews = async () => {
    if (!petId) return;
    const res = await API.get(`/api/reviews/pet/${petId}`);
    setReviews(res.data);
  };

  const fetchAvg = async () => {
    if (!petId) return;
    const res = await API.get(`/api/reviews/pet/${petId}/average`);
    setAvg(res.data.average);
  };

  useEffect(() => {
    fetchReviews();
    fetchAvg();
  }, [petId]);

  const submitReview = async () => {
    if (!petId) return;

    await API.post(`/api/reviews/pet/${petId}`, {
      rating,
      comment,
    });

    setComment("");
    setRating(0);
    fetchReviews();
    fetchAvg();
  };

  

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">🐶 Pet Reviews</h1>

      <p className="text-gray-600 mb-4">
        Average Rating: ⭐ {avg.toFixed(1)}
      </p>

      {/* REVIEW FORM */}
      <div className="bg-white p-4 shadow rounded-xl mb-6">
        <StarRating value={rating} onChange={setRating} />

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write review..."
          className="w-full border p-2 mt-2 rounded"
        />

        <button
          onClick={submitReview}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
      </div>

      {/* LIST REVIEWS */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r._id} className="p-4 bg-gray-100 rounded-xl">
            <div className="text-yellow-500">⭐ {r.rating}</div>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetReviews;