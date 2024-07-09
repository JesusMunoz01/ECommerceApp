import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginButton from "../Auth/auth0-login";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../Auth/auth0-logout";
import { useEffect, useRef, useState } from "react";
import { BsCart4 } from "react-icons/bs";
import SelectedLink from "../Links/selectedLink";
import { useUser } from "../../utils/userContext";

const Navbar = () => {
    const { user, isAuthenticated } = useAuth0();
    const [userMenu, setUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = useUser();

    const toggleUserMenu = () => {
        setUserMenu(!userMenu);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setUserMenu(false);
    }, [location]);

    return (
        <nav className="navbar bg-slate-600 w-full">
            <div className="p-2 xs:p-6 max-w mx-auto flex items-center justify-between w-full">
                {/* <div className="navbar-logo">
                    <a href="/">Home</a>
                </div> */}
                <div className="flex text-md gap-2 sm:text-lg md:text-xl text-white-100 xs:gap-4 lg:gap-16 items-center justify-center">
                    <span className="border-2 border-black p-2">Logo</span>
                    <SelectedLink to="/">Home</SelectedLink>
                    <SelectedLink to="/brands">Brands</SelectedLink>
                </div>
                <div className="sm:flex items-center gap-1 md:gap-4 w-2/6 md:w-2/4 hidden">
                    <div className="flex border border-gray-300 bg-neutral-700 h-10 rounded-lg w-5/6 divide-x divide-white">
                    <input type="text" placeholder="Search" className="w-6/6 md:w-5/6 h-full rounded-l-lg pl-2"/>
                    <select className="md:flex w-1/6 rounded-r-lg hidden">
                        <option value="all">All</option>
                        <option value="brands">Brands</option>
                        <option value="products">Products</option>
                    </select>
                    </div>
                    <button className="bg-green-500 text-sm md:text-base min-w-14 text-white p-1 sm:p-2 rounded-lg md:w-1/6 sm:w-fit flex justify-center">Search</button>
                </div>
                <div className="flex items-center gap-2 xs:gap-4">
                    <SelectedLink to="/cart"><BsCart4 className="text-white text-2xl"/>Cart</SelectedLink>
                    {isAuthenticated ? 
                    <div className="flex items-center gap-4" ref={userMenuRef}>
                        <button onClick={toggleUserMenu} name="accountButton" className="w-12 p-0 h-12 rounded-full bg-transparent">
                            <img src={user?.picture} alt={user?.name} className="rounded-full"/>
                        </button>
                        {userMenu && 
                            <div id="dropdownMenu" className={`fixed flex items-center justify-center flex-col top-20 right-0 mt-4 w-64 bg-white border border-gray-200 divide-y divide-gray-200`}>
                            <div className="px-4 py-3 flex items-center justify-center flex-col">
                                <p className="text-md font-medium text-gray-900">{user?.name}</p>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                            <div className="flex flex-col gap-1 py-1 w-32 items-center justify-center">
                                <Link id="accLink" to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium">Account</Link>
                                <LogoutButton />
                            </div>
                            </div>
                        }
                        {userData?.plan !== "Enterprise" && <button className="bg-slate-900 text-white p-2 rounded-lg"
                            onClick={() => navigate("/upgrade")}>Upgrade</button>}
                    </div>
                    : <LoginButton />}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
