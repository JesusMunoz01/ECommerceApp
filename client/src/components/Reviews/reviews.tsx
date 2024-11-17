import { Review } from "./reviewForm";

type ReviewsProps = {
    review: Review
}

const Reviews = ({review}: ReviewsProps) => {

    return (
        <div>
            <h2>Rating:</h2>
            {[1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={`${star <= review.rating ? "text-yellow-500" : "text-gray-600"}`}
            >
                ★
            </span>
            ))}
            <h2>Review:</h2>
            <p>{review.reviewText}</p>
        </div>
    )
};

export default Reviews