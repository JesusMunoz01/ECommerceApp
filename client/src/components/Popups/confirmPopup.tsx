type ConfirmationPopupProps = {
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel: () => void
};

const ConfirmationPopup = ({ title, message, onConfirm, onCancel }: ConfirmationPopupProps) => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex flex-col gap-4 bg-slate-700 w-5/12 h-2/5 justify-center items-center border-2 border-gray-900">
                <h2 className="self-center text-3xl p-2">{title}</h2>
                <p className="h-fit max-h-48">{message}</p>
                <div className="self-center gap-2 flex pb-1 pt-1">
                    <button className="p-2" onClick={onConfirm}>Confirm</button>
                    <button className="p-2" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
