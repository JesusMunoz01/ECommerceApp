import SubscriptionButton from "../Stripe/SubcriptionButton";

type SubscriptionCardProps = {
    tier: number;
    benefits: string[];
    price: number;
    name: string;
    active: boolean;
};

const SubscriptionCard = ({tier, benefits, name, price, active}: SubscriptionCardProps) => {
    return (
        <div className="flex gap-5">
            <div className="mb-4 flex items-center flex-col bg-slate-500 rounded-md w-80">
                <h1 className="bg-slate-900 w-full text-center text-white h-24">{name}</h1>
                {/* {active && <h2 className="text-center text-white text-4xl">Current</h2> } */}
                {price <= 0 ? <h2 className="text-3xl h-16 mb-2 mt-2">Free</h2> : <h2 className="text-3xl h-16 mb-2 mt-2">${price}</h2>}
                <div className="flex items-center flex-col justify-between h-full">
                    <div className="h-48 flex items-center flex-col">
                        <p className="border-b-2">Features</p>
                        <ul className="flex items-center flex-col h-fit">
                            {benefits.map((benefit) => (
                                <li>* {benefit}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        {tier !== 1 ? <SubscriptionButton tier={tier}/> : <button className="mb-4 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-none" 
                            disabled={true}>Current</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCard;