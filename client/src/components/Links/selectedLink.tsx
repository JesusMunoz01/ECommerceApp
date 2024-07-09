import { Link, useMatch } from "react-router-dom";

interface SelectedLinkProps {
    to: string;
    children: React.ReactNode;
  }
  
const SelectedLink: React.FC<SelectedLinkProps> = ({ to, children }) => {
    const match = useMatch(to);
    return (
        <Link to={to} className={match ? "text-green-500 flex flex-col items-center justify-center" : "hover:text-green-500 flex flex-col justify-center items-center"}>
            {children}
        </Link>
    );
};
export default SelectedLink;