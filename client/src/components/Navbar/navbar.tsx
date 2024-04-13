import { Link, useMatch, useNavigate } from "react-router-dom";
import LoginButton from "../Auth/auth0-login";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../Auth/auth0-logout";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
    const { user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [userMenu, setUserMenu] = useState(false);
    const navigate = useNavigate();

    const getUser = useMemo(() => async () => {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user?.sub}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data;
    }, [getAccessTokenSilently, user?.sub]);

    const userData = useQuery({
        queryKey: ['user', user?.sub],
        queryFn: getUser,
        enabled: !!user
    });

    const toggleUserMenu = () => {
        setUserMenu(!userMenu);
    };

    console.log(userData)

    return (
        <nav className="navbar bg-slate-600 h-24">
            <div className="p-6 max-w mx-auto flex items-center justify-between">
                {/* <div className="navbar-logo">
                    <a href="/">Home</a>
                </div> */}
                <div className="flex text-xl text-white-100 gap-16 items-center justify-center">
                    <span className="border-2 border-black p-2">Logo</span>
                    <SelectedLink to="/">Home</SelectedLink>
                    <SelectedLink to="/test">Brands</SelectedLink>
                </div>
                <div className="flex items-center gap-4 w-2/4">
                    <div className="flex border border-gray-300 bg-neutral-700 h-10 rounded-lg w-5/6 divide-x divide-white">
                    <input type="text" placeholder="Search" className="w-5/6 h-full rounded-l-lg pl-2"/>
                    <select className="w-1/6 rounded-r-lg">
                        <option value="all">All</option>
                        <option value="brands">Brands</option>
                        <option value="products">Products</option>
                    </select>
                    </div>
                    <button className="bg-green-500 text-white p-2 rounded-lg md:w-1/6 sm:w-fit">Search</button>
                </div>
                <div className="flex items-center gap-4">
                    <SelectedLink to="/cart">Cart</SelectedLink>
                    {isAuthenticated ? 
                    <div className="flex items-center gap-4">
                        <button onClick={toggleUserMenu} className="w-12 p-0 h-12 rounded-full bg-transparent">
                            <img src={user?.picture} alt={user?.name} className="rounded-full"/>
                        </button>
                        <div className="flex flex-col gap-1 py-1 w-32 items-center justify-center">
                                <Link to="/sell" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium">Sell</Link>
                        </div>
                        {userMenu && 
                            <div id="dropdownMenu" className={`absolute flex items-center justify-center flex-col top-20 right-0 mt-4 w-64 bg-white border border-gray-200 divide-y divide-gray-200`}>
                            <div className="px-4 py-3 flex items-center justify-center flex-col">
                                <p className="text-md font-medium text-gray-900">{user?.name}</p>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                            <div className="flex flex-col gap-1 py-1 w-32 items-center justify-center">
                                <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium">Account</Link>
                                <LogoutButton />
                            </div>
                            </div>
                        }
                        {userData.data?.plan !== "Enterprise" && <button className="bg-slate-900 text-white p-2 rounded-lg"
                            onClick={() => navigate("/upgrade")}>Upgrade</button>}
                    </div>
                    : <LoginButton />}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
