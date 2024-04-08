import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TodoDialogInterface {
    isOpen: boolean;
    closeTodoModal: () => void;
    selectedDate: string;
}

const TodoDialog: React.FC<TodoDialogInterface> = ({ isOpen, closeTodoModal, selectedDate }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (dialogRef.current) {
            if (isOpen) {
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }
    }, [isOpen]);

    return createPortal(
        <dialog ref={dialogRef} className={"fixed inset-0 z-10 overflow-y-auto"} onClose={closeTodoModal}>
            <div className="flex items-center justify-center">
                <div className="bg-white w-full max-w-lg mx-auto rounded shadow-lg p-6 min-h-96 min-w-40">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">일정 등록</h2>
                    <p className="text-sm text-gray-500 mb-4">{`선택한 날짜는 ${selectedDate} 입니다.`}</p>

                    <p className="text-sm text-gray-500 mb-4">
                        Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.
                    </p>

                    <div className="flex justify-end">
                        <button onClick={closeTodoModal} className="px-4 py-2 mr-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 outline-none" >Cancel</button>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600" >Deactivate</button>
                    </div>
                </div>
            </div>
        </dialog>,
        document.getElementById('modal')!
    )
}

export default TodoDialog;