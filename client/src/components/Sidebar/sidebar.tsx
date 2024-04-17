import LogoutButton from "../Auth/auth0-logout";

type SidebarProps = {
    isOpen: boolean;
    toggle: () => void;
  };

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
    return (
      isOpen && (
        <div className="flex flex-col items-center bg-slate-700 h-full w-32 justify-between">
          <div className="mt-2">
            <h2 className="text-xl border-b border-slate-500 w-full">Account</h2>
            <ul className="flex flex-col mt-4 gap-4">
              <li>Profile</li>
              <li>Settings</li>
            </ul>
          </div>
          <div className="mb-2 flex items-center flex-col gap-2 border-t border-slate-500 w-fit pt-2">
            <LogoutButton />
            <button onClick={toggle}>Close Sidebar</button>
          </div>
        </div>
      )
    );
  };

export default Sidebar;