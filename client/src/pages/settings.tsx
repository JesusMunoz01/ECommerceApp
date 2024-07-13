import { useState } from 'react';
import EditUserForm from '../components/Auth/editUserForm';
import ConfirmationPopup from '../components/Popups/confirmPopup';
import PersonalOptions from '../components/User/PersonalOptions';
import DeleteButton from '../components/Buttons/DeleteButton';
import AccountSecurity from '../components/User/AccountSecurity';
import UserOrders from '../components/User/UserOrders';
import Button from '../components/Buttons/Button';

type editType = "profile" | "security";

const SettingsPage = () => {
  const [type, setType] = useState<editType>("profile");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleToggle = (state: boolean, setState: (state: boolean) => void, type?: editType) => () => {
    setIsProfileOpen(false);
    setIsSecurityOpen(false);
    setIsOrdersOpen(false);
    setState(!state);
    if (type) {
      setType(type);
    }
  };

  return (
    <div className="flex w-full max-w-3xl mx-auto h-full flex-col items-center">
      <h1 className='w-full text-center h-1/6 text-3xl sm:text-6xl'>Account Options</h1>
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
        <Button action={handleToggle(isProfileOpen, setIsProfileOpen)} text='Personal Information' />
        {isProfileOpen && (<PersonalOptions onClick={handleToggle(isEditOpen, setIsEditOpen, "profile")}/>)}
        <Button action={handleToggle(isSecurityOpen, setIsSecurityOpen)} text='Account Security' />
        {isSecurityOpen && (<AccountSecurity onClick={handleToggle(isEditOpen, setIsEditOpen, "security")}/>)}
        <Button action={handleToggle(isOrdersOpen, setIsOrdersOpen)} text='Order History' />
        {isOrdersOpen && (<UserOrders/>)}
      </div>
      <DeleteButton action={handleToggle(isDelete, setIsDelete)} className='w-3/4 text-left'/>
    </div>
  );
}

export default SettingsPage;