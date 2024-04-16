import { useState } from "react";
import Profile from "../components/Auth/auth0-profile";
import Sidebar from "../components/Sidebar/sidebar";

const AccountPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="m-2">
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <Profile />
    </div>
  );
}

export default AccountPage;