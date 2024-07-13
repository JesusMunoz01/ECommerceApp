interface DeleteButtonProps {
    action: () => void;
    children?: React.ReactNode;
    className?: string;
}

const DeleteButton = ({action, children, className}: DeleteButtonProps) => {

    return (
        <button className={`block hover:bg-red-500 bg-red-800 focus:outline-non transition duration-150 ease-in-out px-4 py-2 ${className}`} onClick={action}>
          {children ? children : "Delete User"}
        </button>
    );

}

export default DeleteButton;
