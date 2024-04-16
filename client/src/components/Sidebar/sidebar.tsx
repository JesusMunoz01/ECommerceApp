
type SidebarProps = {
    isOpen: boolean;
    toggle: () => void;
  };

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
    return (
      isOpen && (
        <div className="sidebar">
          <h2>Sidebar</h2>
          <button onClick={toggle}>Close Sidebar</button>
        </div>
      )
    );
  };

export default Sidebar;