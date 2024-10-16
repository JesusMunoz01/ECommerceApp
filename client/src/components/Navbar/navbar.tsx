import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginButton from "../Auth/auth0-login";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../Auth/auth0-logout";
import { useEffect, useRef, useState } from "react";
import { BsCart4 } from "react-icons/bs";
import SelectedLink from "../Links/selectedLink";
import { useUser } from "../../utils/userContext";
import { Product } from "../Products/productCard";

type NavbarProps = {
    products?: Product[];
}

const Navbar = ({products}: NavbarProps) => {
    const { user, isAuthenticated } = useAuth0();
    const [userMenu, setUserMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const userMenuRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = useUser();

    const toggleUserMenu = () => {
        setUserMenu(!userMenu);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    
        if (value.length > 0 && products) {
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredProducts);
        } else {
            setSuggestions([]); // Clear suggestions when input is empty
        }
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
        <nav className="navbar bg-slate-600 w-full h-1/6 overflow-hidden">
            <div className="p-2 xs:p-6 max-w mx-auto flex items-center justify-between w-full h-5/6 relative">
                {/* <div className="navbar-logo">
                    <a href="/">Home</a>
                </div> */}
                <div className="flex text-md gap-2 sm:text-lg md:text-xl text-white-100 xs:gap-4 lg:gap-16 items-center justify-center h-5/6">
                    <span className="border-2 border-black p-2">Logo</span>
                    <SelectedLink to="/">Home</SelectedLink>
                    <SelectedLink to="/brands">Brands</SelectedLink>
                </div>
                <div className="sm:flex items-center gap-1 md:gap-4 w-2/6 md:w-2/4 hidden h-5/6">
                    <div className="flex border border-gray-300 bg-neutral-700 h-10 rounded-lg w-5/6 divide-x divide-white">
                        <input type="text" placeholder="Search" className="w-6/6 md:w-5/6 h-full rounded-l-lg pl-2" onChange={handleSearchChange}
                            value={searchTerm}/>
                        <select className="md:flex w-1/6 rounded-r-lg hidden">
                            <option value="all">All</option>
                            <option value="brands">Brands</option>
                            <option value="products">Products</option>
                        </select>
                        {/* Suggestion dropdown */}
                        {suggestions.length > 0 && (
                            <ul className="fixed left-0 right-10 top-16 bg-white text-black shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto w-3/12 md:w-2/6 justify-self-center">
                                {suggestions.map((product) => (
                                    <li
                                        key={product.id}
                                        onClick={() => setSearchTerm(product.name)} // When clicking, set search term
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                    >
                                        {product.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button className="bg-green-500 text-sm md:text-base min-w-14 text-white p-1 sm:p-2 rounded-lg md:w-1/6 sm:w-fit flex justify-center">Search</button>
                </div>
                <div className="flex items-center gap-2 xs:gap-4 h-5/6">
                    <SelectedLink to="/cart"><BsCart4 className="text-white xs:text-2xl"/>Cart</SelectedLink>
                    {isAuthenticated ? 
                    <div className="flex items-center flex-col xs:flex-row gap-1 md:gap-4" ref={userMenuRef}>
                        <button onClick={toggleUserMenu} name="accountButton" className="w-10 xs:w-12 p-0 h-10 xs:h-12 rounded-full bg-transparent">
                            <img src={user?.picture} alt={user?.name} className="rounded-full"/>
                        </button>
                        {userMenu && 
                            <div id="dropdownMenu" className={`fixed flex items-center justify-center flex-col top-16 xs:top-20 right-0 mt-6 xs:mt-2 w-full xs:w-64 h-1/4 xs:h-fit bg-white border border-gray-200 divide-y divide-gray-200`}>
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
                        {userData?.plan !== "Enterprise" && <button className="bg-slate-900 text-white text-xs p-1 xs:text-base xs:p-2 rounded-lg"
                            onClick={() => navigate("/upgrade")}>Upgrade</button>}
                    </div>
                    : <LoginButton />}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
