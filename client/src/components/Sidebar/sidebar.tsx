import LogoutButton from "../Auth/auth0-logout";
import SelectedLink from "../Links/selectedLink";

type SidebarProps = {
    isOpen: boolean;
    toggle: () => void;
  };

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
    return (
      isOpen ? (
        <div className="flex flex-col items-center bg-slate-700 h-full w-1/12 justify-between">
          <div className="mt-2">
            <h2 className="text-xl border-b border-slate-500 w-full">Account</h2>
            <ul className="flex flex-col mt-4 gap-4">
              <li><SelectedLink to="/account">Profile</SelectedLink></li>
              <li><SelectedLink to="/settings">Settings</SelectedLink></li>
              <li><SelectedLink to="/sell">Sell</SelectedLink></li>
            </ul>
          </div>
          <div className="mb-2 flex items-center flex-col gap-2 border-t border-slate-500 w-fit pt-2">
            <LogoutButton />
            <button onClick={toggle}>Close Sidebar</button>
          </div>
        </div>
      )
      :
        <button className={"w-1/12"}onClick={toggle}>Open Sidebar</button>
    );
  };

export default Sidebar;