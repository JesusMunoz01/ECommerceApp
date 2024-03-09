import "./navbar.css";

const Navbar = () => 
{
    return (
        <nav className="navbar">
        <ul className="p-6 max-w mx-auto flex items-center justify-between">
            <li className="navbar-list-item">Home</li>
            <li className="navbar-list-item">Login</li>
            <li className="navbar-list-item">Test</li>
        </ul>
        </nav>
    );
};
export default Navbar;
