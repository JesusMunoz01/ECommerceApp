import { useState } from "react";
import Profile from "../components/Auth/auth0-profile";
import Sidebar from "../components/Sidebar/sidebar";

const AccountPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex gap-2" style={{ height: 'calc(100vh - 6rem)' }}>
      <div className="flex flex-col h-full">
        {!isSidebarOpen && <button onClick={toggleSidebar}>Toggle Sidebar</button>}
          <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      </div>
      <div className="mt-2">
        <Profile />
      </div>
    </div>
  );
}

export default AccountPage;