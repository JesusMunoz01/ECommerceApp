import SubscriptionButton from "../components/Stripe/SubcriptionButton";

const UpgradePage = () => {
    return (
        <div className="flex items-center flex-col">
        <h1>Upgrade your Account</h1>
        <p>Upgrade your account to access premium features</p>
        <div className="flex gap-5">
            <div className="mb-4 flex items-center flex-col bg-slate-500 rounded-md w-80">
                <h2 className="text-4xl">Current</h2>
                <h3>Free</h3>
                <div className="flex items-center flex-col">
                    <p className="border-b-2">Features</p>
                    <ul className="flex items-center flex-col">
                        <li>Buy Items</li>
                        <li>Sell Items {`(50 Max)`}</li>
                    </ul>
                </div>
            </div>
            <div className="mb-4 flex items-center flex-col bg-slate-500 rounded-md w-80">
                <h2 className="text-4xl">Premium</h2>
                <h3>$1.99</h3>
                <div className="flex items-center flex-col">
                    <p className="border-b-2">Features</p>
                    <ul className="flex items-center flex-col">
                        <li>Buy Items</li>
                        <li>Sell Items {`(1000 Max)`}</li>
                    </ul>
                </div>
            </div>
            <div className="mb-4 flex items-center flex-col bg-slate-500 rounded-md w-80">
                <h2 className="text-4xl">Enterprise</h2>
                <h3>$2.99</h3>
                <div className="flex items-center flex-col">
                    <p className="border-b-2">Features</p>
                    <ul className="flex items-center flex-col">
                        <li>Buy Items</li>
                        <li>Sell Items {`(Infinite)`}</li>
                        <li>Create a Brand Page</li>
                    </ul>
                </div>
            </div>
        </div>
        <SubscriptionButton />
        </div>
    );

};

export default UpgradePage;