import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export type Review = {
    rating: number,
    reviewText: string
}

type ReviewForm = {
    productId: number
}

const ReviewForm = ({productId} : ReviewForm) => {
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0()
    const [reviewData, setReviewData] = useState<Review>({rating: 0, reviewText: ""})
    const [hoverRating, setHoverRating] = useState(0);
    const submitMutation = useMutation({
        mutationKey: ["createReview"],
        mutationFn: async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                throw new Error('Failed to create review');
            }

            return response.json();
        },
        // TODO: Update once review fetching is implemented
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reviews" + productId]
            });
        },
    })
    const stars = [1, 2, 3, 4, 5]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(reviewData.rating === 0 || reviewData.reviewText === ""){
            console.log("error")
            return
        }
        submitMutation.mutate()
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
                        data-testid={`star-${star}`}
                        className={`cursor-pointer font-semibold ${star <= (hoverRating || reviewData.rating) ? "text-yellow-500" : "text-gray-600"}`}
                        onClick={() => setReviewData((prev: Review) => ({...prev, rating: star}))}
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
                    name="reviewText"
                    rows={5}
                    value={reviewData.reviewText}
                    onChange={(e) => {setReviewData((prev) => ({...prev, reviewText: e.target.value}))}}
                />
            </div>
            <button className="bg-green-600 text-white text-sm sm:text-base p-1 md:p-2 rounded-lg w-fit sm:w-1/4 md:w-2/4 self-center" 
                name="submitReview" onClick={(e) => handleSubmit(e)}>
                Submit Review
            </button>
        </form>
    )
};

export default ReviewForm