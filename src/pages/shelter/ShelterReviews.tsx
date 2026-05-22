import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import StarRating from "../../components/StarRating";
import { useAuth } from "../../context/AuthContext";

const ShelterReviews = () =>
{
	const { id } = useParams();
	const { user } = useAuth();

	const [reviews, setReviews] = useState<any[]>([]);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [avg, setAvg] = useState<number>(0);

	const fetchReviews = async () =>
	{
		try
		{
			if (!id) return;

			const res = await API.get(
				`/reviews/${id}`
			);

			setReviews(res.data || []);

		}catch(err:any)
		{
			console.log("Review error:", err);
		}
	};

	const fetchAvg = async () =>
	{
		try
		{
			if (!id) return;

			const res = await API.get(
				`/reviews/${id}/average`
			);

			setAvg(
				Number(
					res.data.averageRating || 0
				)
			);

		}catch(err:any)
		{
			console.log("Average error:", err);
		}
	};

	useEffect(() =>
	{
		fetchReviews();
		fetchAvg();
	}, [id]);

	const submitReview = async () =>
	{
		try
		{
			if (!id) return;

			await API.post(
				`/reviews/${id}`,
				{
					rating,
					comment,
				}
			);

			setRating(0);
			setComment("");

			fetchReviews();
			fetchAvg();

		}catch(err:any)
		{
			console.log("Submit error:", err);
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6">

			<h1 className="text-2xl font-bold mb-4">
				🏠 Shelter Reviews
			</h1>

			<p className="text-gray-600 mb-6">
				Average Rating:
				⭐ {avg}
			</p>

			{user?._id !== id && (
				<div className="bg-white p-4 shadow rounded-xl mb-6">

					<StarRating
						value={rating}
						onChange={setRating}
					/>

					<textarea
						value={comment}
						onChange={(e) =>
							setComment(e.target.value)
						}
						placeholder="Write review..."
						className="w-full border p-2 mt-2 rounded"
					/>

					<button
						onClick={submitReview}
						className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
					>
						Submit Review
					</button>

				</div>
			)}
			<div className="space-y-4">
				{reviews.length > 0 ? (
					reviews.map((r) => (
						<div
							key={r._id}
							className="p-4 bg-gray-100 rounded-xl"
						>
							<div className="text-yellow-500">
								⭐ {r.rating}
							</div>

							<p>{r.comment}</p>

							<p className="text-sm text-gray-500">
								{r.user?.name}
							</p>
						</div>
					))
				) : (
					<p>No reviews yet</p>
				)}
			</div>

		</div>
	);
};

export default ShelterReviews;