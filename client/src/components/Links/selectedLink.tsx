import { Link, useMatch } from "react-router-dom";

interface SelectedLinkProps {
    to: string;
    children: React.ReactNode;
  }
  
const SelectedLink: React.FC<SelectedLinkProps> = ({ to, children }) => {
    const match = useMatch(to);
    return (
        <Link to={to} className={match ? "text-green-500" : "hover:text-green-500"}>
            {children}
        </Link>
    );
};
export default SelectedLink;