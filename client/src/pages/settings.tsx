import { useState } from 'react';
import EditUserForm from '../components/Products/editUserForm';

const SettingsPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="shadow-md rounded my-6">
        <button 
          className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-full text-left px-4 py-2 rounded-none"
          onClick={handleToggle}
        >
          Edit User
        </button>
        {isOpen && (
            <div className="border-t">
                <EditUserForm />
            </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;