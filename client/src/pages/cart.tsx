import { Product } from "../components/Products/productCard";

type CartProps = {
    cart: Product[];
};

const Cart = ({cart}: CartProps) => {
    return (
        <div>
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
    );
}

export default Cart;