import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Review = {
    rating: number,
    reviewText: string
}

const ReviewForm = () => {
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0()
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("")
    const submitMutation = useMutation({
        mutationKey: ["createReview"],
        mutationFn: async (review: Review) => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/brands`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(review)
            });

            if (!response.ok) {
                throw new Error('Failed to create brand');
            }

            return response.json();
        },
        // TODO: Update once review fetching is implemented
        // onSuccess: () => {
        //     queryClient.invalidateQueries({
        //         queryKey: ["reviews"]
        //     });
        //     console.log('Brand created successfully');
        //     navigate('/account');
        // },
    })
    const stars = [1, 2, 3, 4, 5]

    const handleSubmit = () => {

    }

    return (
        <form className="flex flex-col p-2 gap-2">
            <h2 className="text-center">Leave a Review</h2>
            <div className="flex flex-col">
                <label>Rating:</label>
                <div>
                    {stars.map((star) => (
                        <span
                        key={star}
                        className={`cursor-pointer font-semibold ${star <= (hoverRating || rating) ? "text-yellow-500" : "text-gray-600"}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex flex-col">
                <label>Review:</label>
                <textarea 
                    className="p-1"
                    rows={5}
                    value={reviewText}
                    onChange={(e) => {setReviewText(e.target.value)}}
                />
            </div>
            <button className="bg-green-600 text-white text-sm sm:text-base p-1 md:p-2 rounded-lg w-fit sm:w-1/4 md:w-2/4 self-center" 
                onClick={() => {}}>
                Submit Review
            </button>
        </form>
    )
};

export default ReviewForm