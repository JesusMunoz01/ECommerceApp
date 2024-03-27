import SubscriptionButton from "../components/Stripe/SubcriptionButton";

const UpgradePage = () => {
    return (
        <div>
        <h1>Upgrade your Account</h1>
        <p>Upgrade your account to access premium features</p>
        <div className="mb-4">
            <h2>Current</h2>
            <p>Free</p>
            <div>
                <p>Features</p>
                <ul>
                    <li>Feature 1</li>
                    <li>Feature 2</li>
                    <li>Feature 3</li>
                </ul>
            </div>
        </div>
        <div className="mb-4">
            <h2>Premium</h2>
            <div>
                <p>Features</p>
                <ul>
                    <li>Feature 1</li>
                    <li>Feature 2</li>
                    <li>Feature 3</li>
                </ul>
            </div>
        </div>
        <div className="mb-4">
            <h2>Enterprise</h2>
            <div>
                <p>Features</p>
                <ul>
                    <li>Feature 1</li>
                    <li>Feature 2</li>
                    <li>Feature 3</li>
                </ul>
            </div>
        </div>
        <SubscriptionButton />
        </div>
    );

};

export default UpgradePage;