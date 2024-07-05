import Profile from "../Auth/auth0-profile";

interface PersonalOptionsProps {
    onClick: () => void;
}

const PersonalOptions = ({onClick}: PersonalOptionsProps) => {
    
    return (
        <div className="border-t flex flex-col gap-2">
        <Profile/>
            <button className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-1/2 text-center px-4 py-2 rounded-md self-center" 
            onClick={onClick}>Edit</button>
        </div>
    )
    
};

export default PersonalOptions;
