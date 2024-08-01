interface ButtonProps {
    action: (e?: React.FormEvent) => void;
    text?: string;
    children?: React.ReactNode;
}

const Button = ({action, text, children}: ButtonProps) => {
    return (
        <button className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-full text-left px-4 py-2 rounded-md min-h-12"
            onClick={action}
        >
            {text}
            {children}
        </button>
    );
}

export default Button;
