import SubscriptionCard from "../components/Products/subscriptionCard";

const subscriptionData = [
    {
        tier: 1,
        benefits: ["Buy Items", "Sell Items (100 Max)"],
        name: "Basic",
        price: 0,
        active: true
    },
    {
        tier: 2,
        benefits: ["Buy Items", "Sell Items (1000 Max)"],
        name: "Premium",
        price: 9.99,
        active: false
    },
    {
        tier: 3,
        benefits: ["Buy Items", "Sell Items", "Sell Unlimited Items", "Access Premium features", "Create a brand page" ],
        name: "Enterprise",
        price: 19.99,
        active: false
    }
];

type UpgradePageProps = {
    role: string
}

const UpgradePage = ({role}: UpgradePageProps) => {

    const modifyActive = () => {
        // Iterate through all tiers and make them active until the user's tier is reached
        for (let i = 0; i < subscriptionData.length; i++) {
            subscriptionData[i].active = true;
            if (subscriptionData[i].name === role) {
                break;
            }
        }
    }

    if(role) modifyActive();

    return (
        <div className="flex items-center flex-col" style={{height: "calc(100vh - 6rem)"}}>
            <h1 className="h-20">Subscriptions</h1>
            <p>Upgrade your account to access premium features</p>
            <div className="flex gap-5 mt-4">
                {subscriptionData.map((subscription) => (
                    <SubscriptionCard tier={subscription.tier} benefits={subscription.benefits} 
                        name={subscription.name} price={subscription.price} active={subscription.active}/>
                ))}
            </div>
        </div>
    );

};

export default UpgradePage;