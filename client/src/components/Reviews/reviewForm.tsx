import { useState } from "react";

const ReviewForm = () => {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("")
    const stars = [1, 2, 3, 4, 5]

    return (
        <form>
            <h2>Leave a Review</h2>
            <div className="flex flex-col">
                <label>Review:</label>
                <textarea rows={5} />
            </div>
            <div>
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
        </form>
    )
};

export default ReviewForm