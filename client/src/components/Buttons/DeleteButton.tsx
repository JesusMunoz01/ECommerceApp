interface DeleteButtonProps {
    action: () => void;
}

const DeleteButton = ({action}: DeleteButtonProps) => {

    return (
        <div className='flex flex-col shadow-md rounded my-6 gap-4 h-1/6 w-3/4'>
        <button 
          className="block hover:bg-red-500 bg-red-800 focus:outline-non transition duration-150 ease-in-out w-full text-left px-4 py-2 rounded-none"
          onClick={action}
        >
          Delete User
        </button>
      </div>
    );

}

export default DeleteButton;
