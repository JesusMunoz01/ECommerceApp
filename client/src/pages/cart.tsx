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
        <div className="flex flex-row w-full h-full" style={{ height: 'calc(100vh - 6rem)' }}>
            <div className="flex w-3/4 flex-col items-center">
                <div className="flex flex-col w-full bg-slate-700 h-full">
                <h1 className="ml-2 mr-2 border-b-2 p-2">Your Cart</h1>
                <br/>
                    {cart.length > 0 ? cart.map((product) => (
                        <div key={product.id} className="flex flex-col mb-2 ml-2 mr-2 gap-1 border-2 p-2 w-3/12">
                            <h2 className=" text-2xl">{product.name}</h2>
                            <p>Price: {product.price}</p>
                            <p>Amount: {product.quantity}</p>
                            <button className="bg-red-500 text-white p-1" onClick={() => removeFromCart(product.id)}>Remove</button>
                        </div>
                    )) : (<p className="m-2">No items in your cart</p>)}
                </div>
            </div>
            <div className="flex flex-col w-1/4 bg-slate-800 h-full gap-2 justify-between items-center">
                <h1>Checkout</h1>
                <div className=" text-2xl">
                    <h2>Total Items: {cart.length}</h2>
                    <h2>Total: ${cart.reduce((acc, product) => acc + product.price * product.quantity, 0)}</h2>
                </div>
                <CheckoutButton cart={cart}/>
            </div>
        </div>
    );
}

export default Cart;