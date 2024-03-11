import { Link, useMatch } from "react-router-dom";
import LoginButton from "../Auth/auth0-login";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../Auth/auth0-logout";
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

const Navbar = () => {
    const { user, isAuthenticated } = useAuth0();

    return (
        <nav className="navbar bg-slate-600">
            <div className="p-6 max-w mx-auto flex items-center justify-between">
                {/* <div className="navbar-logo">
                    <a href="/">Home</a>
                </div> */}
                <div className="flex text-xl text-white-100 gap-16">
                    <SelectedLink to="/">Home</SelectedLink>
                    <SelectedLink to="/test">Test</SelectedLink>
                </div>
                <div className="navbar-links">
                    {isAuthenticated ? 
                    <div className="flex items-center gap-4">
                        <LogoutButton /> 
                        <img src={user?.picture} alt={user?.name} className="w-10 h-10 rounded-full" />
                    </div>
                    : <LoginButton />}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
