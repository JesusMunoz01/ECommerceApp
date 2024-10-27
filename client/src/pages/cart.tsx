import CheckoutButton from "../components/Stripe/CheckoutButton";

type CartProps = {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

export type CartItem = {
    id: number
    name: string
    price: number
    quantity: number
}

const Cart = ({cart, setCart}: CartProps) => {

    const removeFromCart = (id: number) => {
        setCart((prevCart) => prevCart.filter((product) => product.id !== id));
    }

    return (
        <div className="flex flex-col md:flex-row w-full min-h-full justify-between bg-slate-700">
            <div className="flex w-4/4 md:w-3/4 flex-col items-center">
                <div className="flex flex-col w-full bg-slate-700 h-full">
                    <h1 className="ml-2 mr-2 border-b-2 h-28 p-2">Your Cart</h1>
                    <br/>
                    {cart.length > 0 ? cart.map((product) => (
                        <div key={product.id} className="flex flex-col mb-2 ml-2 mr-2 gap-1 border-2 p-2 xs:w-3/4 sm:w-6/12 min-h-fit">
                            <h2 className="text-2xl min-h-8">{product.name}</h2>
                            <img src="http://localhost:3000/static/images/test-image.png" alt="test" className="p-2"/>
                            <p>Price: ${product.price}</p>
                            <p>Amount: {product.quantity}</p>
                            <button className="bg-red-500 text-white p-1" onClick={() => removeFromCart(product.id)}>Remove</button>
                        </div>
                    )) : (<p className="m-2">No items in your cart</p>)}
                </div>
            </div>
            <div className="flex flex-col w-4/4 md:w-1/4 bg-slate-800 gap-2 justify-between items-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl p-2">Checkout</h1>
                <div className="md:text-2xl">
                    <h2>Total Items: {cart.length}</h2>
                    <h2>Total: ${cart.reduce((acc, product) => acc + product.price * product.quantity, 0)}</h2>
                </div>
                <CheckoutButton cart={cart}/>
            </div>
        </div>
    );
}

export default Cart;