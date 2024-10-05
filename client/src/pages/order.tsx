const OrderPage = () => {

    const tempData = {
        id: 12,
        date: Date.now(),
        items: [{id:1, name: "item"}, {id:2, name: "item"}]
    }

    return (
        <div>
            <h1>Your Order</h1>
            <h2>ID: {tempData.id}</h2>
            <div>
                <h2>Order Details</h2>
                <h3>Items:</h3>
                <ul>
                    {tempData.items.map((item, index) => (
                        <li>{index + 1}: {item.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default OrderPage;