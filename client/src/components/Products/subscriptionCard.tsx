import { useUser } from "../../utils/userContext";
import SubscriptionButton from "../Stripe/SubcriptionButton";

type SubscriptionCardProps = {
    tier: number;
    benefits: string[];
    price: number;
    name: string;
    active: boolean;
};

const SubscriptionCard = ({tier, benefits, name, price, active}: SubscriptionCardProps) => {
    const { userData } = useUser();

    return (
        <div className="flex gap-5">
            <div className="mb-4 flex items-center flex-col bg-slate-500 rounded-md w-80">
                <h1 className="bg-slate-900 w-full text-center text-white min-h-20">{name}</h1>
                { userData?.plan === `${name}` ? <h2 className="text-3xl h-16 mb-2 mt-2">Current</h2> :
                  userData?.plan === "Premium" && tier === 3 ?
                  <div className="h-16 flex justify-center mt-2 mb-2">
                        <h2 className="text-3xl line-through">${price}</h2>
                        <h2 className="text-3xl">${(price - 10).toFixed(2)}</h2>
                  </div>
                  :
                  price <= 0 ? <h2 className="text-3xl h-16 mb-2 mt-2">Free</h2> : <h2 className="text-3xl h-16 mb-2 mt-2">${price}</h2>}
                <div className="flex items-center flex-col justify-between h-full">
                    <div className="h-48 flex items-center flex-col">
                        <p className="border-b-2">Features</p>
                        <ul className="flex items-center flex-col h-fit">
                            {benefits.map((benefit) => (
                                <li key={benefit}>* {benefit}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center flex-col">
                        { userData?.plan === `${name}` && userData?.subEndDate >= `${new Date().toISOString().split('T')[0]}` &&
                        <span className="text-gray-300 mb-2">Subscription renews on {userData.subEndDate}</span>}
                        {tier !== 1 && !active ? <SubscriptionButton tier={tier}/> : 
                        <button className="mb-4 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-none p-2 w-24" 
                            disabled={true}>Active</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCard;