import { Product } from "../components/Products/productCard";

type CartProps = {
    cart: Product[];
};

const Cart = ({cart}: CartProps) => {
    return (
        <div className="flex flex-row w-full h-full" style={{ height: 'calc(100vh - 6rem)' }}>
            <div className="flex w-3/4 flex-col items-center">
                <h1>Cart</h1>
                <div>
                    {cart.length > 0 ? cart.map((product) => (
                        <div key={product.id}>
                            <h2>{product.name}</h2>
                            <p>{product.price}</p>
                        </div>
                    )) : (<p>No items in cart</p>)}
                </div>
            </div>
            <div className="flex flex-col w-1/4 bg-slate-500 h-full gap-2 justify-between items-center">
                <h1>Total: {cart.reduce((acc, product) => acc + product.price, 0)}</h1>
                <button className="mb-4 w-7/12">Checkout</button>
            </div>
        </div>
    );
}

export default Cart;