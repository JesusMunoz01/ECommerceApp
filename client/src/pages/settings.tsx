import { useState } from 'react';
import EditUserForm from '../components/Auth/editUserForm';
import ConfirmationPopup from '../components/Popups/confirmPopup';
import Profile from '../components/Auth/auth0-profile';
import PersonalOptions from '../components/User/PersonalOptions';
import DeleteButton from '../components/Buttons/DeleteButton';

type editType = "profile" | "security";

const SettingsPage = () => {
  const [type, setType] = useState<editType>("profile");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleToggle = (state: boolean, setState: (state: boolean) => void, type?: editType) => () => {
    setState(!state);
    if (type) {
      setType(type);
    }
  };

  return (
    <div className="flex w-full max-w-3xl mx-auto h-full flex-col items-center">
      <h1 className='w-full text-center h-1/6'>Account Options</h1>
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
      {isEditOpen && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
            <EditUserForm onCancel={handleToggle(isEditOpen, setIsEditOpen)} type={type}/>
        </div>
      )}
      <div className="flex flex-col my-6 gap-4 h-4/6 w-3/4">
        <button 
            className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-full text-left px-4 py-2 rounded-none"
            onClick={handleToggle(isProfileOpen, setIsProfileOpen)}>Peronal Information
        </button>
        {isProfileOpen && (<PersonalOptions onClick={handleToggle(isEditOpen, setIsEditOpen, "profile")}/>)}
        <button 
          className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-full text-left px-4 py-2 rounded-none"
          onClick={handleToggle(isSecurityOpen, setIsSecurityOpen)}
        >
          Account Security
        </button>
        {isSecurityOpen && (
            <div className="border-t flex flex-col gap-2">
                <Profile/>
                <button className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-1/2 text-center px-4 py-2 rounded-md self-center" 
                onClick={handleToggle(isEditOpen, setIsEditOpen, "security")}>Edit</button>
            </div>
        )}
        <button 
          className="block hover:bg-slate-400 focus:outline-non transition duration-150 ease-in-out w-full text-left px-4 py-2 rounded-none"
          onClick={handleToggle(isOrdersOpen, setIsOrdersOpen)}>View Orders</button>
      </div>
      <DeleteButton action={handleToggle(isDelete, setIsDelete)}/>
    </div>
  );
}

export default SettingsPage;