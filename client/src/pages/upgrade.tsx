import SubscriptionButton from "../components/Stripe/SubcriptionButton";

const UpgradePage = () => {
    return (
        <div className="flex items-center flex-col" style={{height: "calc(100vh - 6rem)"}}>
        <h1 className="h-20">Upgrade your Account</h1>
        <p>Upgrade your account to access premium features</p>
        <div className="flex gap-5">
            <div className="mb-4 flex items-center flex-col bg-slate-500 rounded-md w-80">
                <h2 className="text-4xl h-12">Current</h2>
                <h3>Free</h3>
                <div className="flex items-center flex-col">
                    <p className="border-b-2">Features</p>
                    <ul className="flex items-center flex-col">
                        <li>Buy Items</li>
                        <li>Sell Items {`(50 Max)`}</li>
                    </ul>
                    <button className="mb-4 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-none" 
                       disabled={true}>Current</button>
                </div>
            </div>
            <div className="mb-4 flex items-center flex-col bg-slate-500 rounded-md w-80">
                <h2 className="text-4xl h-12">Premium</h2>
                <h3>$1.99</h3>
                <div className="flex items-center flex-col">
                    <p className="border-b-2">Features</p>
                    <ul className="flex items-center flex-col">
                        <li>Buy Items</li>
                        <li>Sell Items {`(1000 Max)`}</li>
                    </ul>
                    <SubscriptionButton tier={2}/>
                </div>
            </div>
            <div className="mb-4 flex items-center flex-col bg-slate-500 rounded-md w-80">
                <h2 className="text-4xl h-12">Enterprise</h2>
                <h3>$2.99</h3>
                <div className="flex items-center flex-col">
                    <p className="border-b-2">Features</p>
                    <ul className="flex items-center flex-col">
                        <li>Buy Items</li>
                        <li>Sell Items {`(Infinite)`}</li>
                        <li>Create a Brand Page</li>
                    </ul>
                    <SubscriptionButton tier={3}/>
                </div>
            </div>
        </div>
        </div>
    );

};

export default UpgradePage;