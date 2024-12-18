import { useParams } from "react-router-dom"
import { Product } from "../components/Products/productCard";
import { CartItem } from "./cart";
import { useState } from "react";
import ReviewForm, { Review } from "../components/Reviews/reviewForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Reviews from "../components/Reviews/reviews";
import { useUser } from "../utils/userContext";
import { useAuth0 } from "@auth0/auth0-react";

type ProductPageProps = {
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    products: Product[]
}

const ProductPage = ({setCart, products}: ProductPageProps) => {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();
    const { userData } = useUser()
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const addToCart = (cartProduct: CartItem) => {
        setCart((prevCart) => [...prevCart, cartProduct]);
    };
    const reviewsQuery = useQuery({
        queryKey: ["reviews" + id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}/reviews`)
            const data = await response.json();
            console.log(data)
            return data
        }
    })

    const deleteQuery = useMutation({
        mutationKey: ["reviews" + id],
        mutationFn: async () => {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}/reviews`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            const data = await response.json();
            console.log(data)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reviews" + id]
            });
        },
    })

    const product = id ? products.find(p => p.id === parseInt(id)) : null;

    if (!product) return <div>Product not found</div>;

    const addProduct = () => {
        if(addToCart){
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
            });
            setQuantity(1);
        }
    };

    if(reviewsQuery.isLoading)
        return <h1>Loading...</h1>

    return (
        <div className="flex flex-col pt-2 gap-4">
            <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2">
                    {product.stock < 3 ? <strong>Only ${product.stock} left!</strong> : null}
                    <h1 className="text-center text-3xl md:text-5xl p-2">{product.name}</h1>
                    <img src="http://localhost:3000/static/images/test-image.png" alt="test" className="p-2"/>
                </div>
                <div className="md:w-1/2 flex flex-col gap-2 p-3 justify-between">
                    <div className="flex flex-col gap-2 p-3 h-3/4">
                        {reviewsQuery.data.reviews &&
                            <p>
                                <span className="pr-2">
                                    Overall Rating:
                                </span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}
                                    data-overallStars={`star-${star}`}
                                    className={`${star <= reviewsQuery.data.reviews.reduce((overall: number, review: Review) => (overall + review.rating), 0) / reviewsQuery.data.reviews.length ? "text-yellow-500" : "text-gray-600"}`}>
                                        ★
                                    </span>
                                ))}
                                <span className="text-sm text-gray-300 pl-2">
                                    {reviewsQuery.data.reviews.length} Reviews
                                </span>
                            </p>
                        }
                        <p className="text-2xl">Price: ${product.price}</p>
                        <p className="text-lg">{product.description}</p>
                    </div>
                    <div className="flex flex-col justify-end h-1/4 gap-2">
                        <div className="flex items-center justify-center gap-1">
                                <button className="flex justify-center items-center w-10 sm:w-12 h-6" onClick={() => setQuantity((prev) => prev - 1)}>-</button>
                                <p className="mx-2">{quantity}</p>
                                <button className="flex justify-center items-center w-10 sm:w-12 h-6" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                        </div>
                        <div className="flex items-center justify-center">
                            <button className="bg-green-600 text-white text-sm sm:text-base p-1 lg:p-2 rounded-lg w-3/4 sm:w-2/4" onClick={addProduct}>Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
            { !userData?.reviews?.find(review => review.productId === product.id) &&
                <div className="flex flex-col self-center w-2/3">
                    <ReviewForm productId={product.id}/>
                </div>
            }
            <div className="flex flex-col border-white border m-2 p-2 gap-4">
                <h2 className="text-xl md:text-3xl">Reviews:</h2>
                {reviewsQuery.data.reviews && reviewsQuery.data.reviews.map((review: Review & {id: number}, index: number) => 
                    <div>
                        <Reviews key={review.id} review={review}/>
                        {userData?.reviews?.find(userReview => userReview.productId === review.id) &&
                        <button name={`deleteReview${index}`} onClick={() => deleteQuery.mutate()}>Delete</button>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductPage