import { useState } from 'react';
import EditUserForm from '../components/Products/editUserForm';
import ConfirmationPopup from '../components/Popups/confirmPopup';

const SettingsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleToggle = (state: boolean, setState: (state: boolean) => void) => () => {
    setState(!state);
  };

  return (
    <div className="flex w-full max-w-3xl mx-auto h-full flex-col items-center">
      <h1 className='w-full text-center h-24'>Account Options</h1>
      {isDelete && 
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
          <ConfirmationPopup 
            title="Delete User"
            message="Are you sure you want to delete your account?"
            onConfirm={() => console.log('User deleted')}
            onCancel={handleToggle(isDelete, setIsDelete)}
          />
        </div>
      }
      <div className="flex flex-col shadow-md rounded my-6 gap-4 h-full w-3/4">
      <button 
          className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-full text-left px-4 py-2 rounded-none"
          onClick={handleToggle(isOpen, setIsOpen)}>Peronal Information</button>
        <button 
          className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-full text-left px-4 py-2 rounded-none"
          onClick={handleToggle(isOpen, setIsOpen)}
        >
          Account Security
        </button>
        {isOpen && (
            <div className="border-t">
                <EditUserForm/>
            </div>
        )}
        <button 
          className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-full text-left px-4 py-2 rounded-none"
          onClick={handleToggle(isOpen, setIsOpen)}>View Orders</button>
        <button 
          className="block hover:bg-red-500 bg-red-800 focus:outline-non transition duration-150 ease-in-out w-full text-left px-4 py-2 rounded-none"
          onClick={handleToggle(isDelete, setIsDelete)}
        >
          Delete User
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;