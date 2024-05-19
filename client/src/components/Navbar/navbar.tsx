import { Link, useNavigate } from "react-router-dom";
import LoginButton from "../Auth/auth0-login";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../Auth/auth0-logout";
import { useState } from "react";
import { BsCart4 } from "react-icons/bs";
import SelectedLink from "../Links/selectedLink";

type NavbarProps = {
    userData: any;
}

const Navbar = ({userData}: NavbarProps) => {
    const { user, isAuthenticated } = useAuth0();
    const [userMenu, setUserMenu] = useState(false);
    const navigate = useNavigate();

    const toggleUserMenu = () => {
        setUserMenu(!userMenu);
    };

    return (
        <nav className="navbar bg-slate-600 h-24">
            <div className="p-6 max-w mx-auto flex items-center justify-between">
                {/* <div className="navbar-logo">
                    <a href="/">Home</a>
                </div> */}
                <div className="flex text-xl text-white-100 gap-16 items-center justify-center">
                    <span className="border-2 border-black p-2">Logo</span>
                    <SelectedLink to="/">Home</SelectedLink>
                    <SelectedLink to="/brands">Brands</SelectedLink>
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
                    <SelectedLink to="/cart"><BsCart4 className="text-white text-2xl"/>Cart</SelectedLink>
                    {isAuthenticated ? 
                    <div className="flex items-center gap-4">
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
