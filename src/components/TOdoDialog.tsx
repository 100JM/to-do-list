import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface TodoDialogInterface {
    isOpen: boolean;
    closeTodoModal: () => void;
    selectedDate: {
        startDate: string,
        endDate: string
    };
}

const TodoDialog: React.FC<TodoDialogInterface> = ({ isOpen, closeTodoModal, selectedDate }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (dialogRef.current) {
            if (isOpen) {
                dialogRef.current.show();
            } else {
                dialogRef.current.close();
            }
        }
    }, [isOpen]);

    const escKeyDown = (e:any) => {
        if(e.key === 'Escape'){
            closeTodoModal();
        }
    }

    return createPortal(
        <dialog className="bg-white shadow-2xl rounded-lg p-6 w-11/12 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-1/2" ref={dialogRef} onClose={closeTodoModal} onKeyDown={escKeyDown}>
            <div className="flex justify-between">
                <IconButton aria-label="delete" size="large" onClick={closeTodoModal}>
                    <DeleteIcon />
                </IconButton>
                <Button variant="text">저장</Button>
            </div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">일정 등록</h2>
            </div>
            <div className="text-gray-700 mb-4">
                <div className="border-gray-300 border-b p-2">
                    <input type="text" placeholder="제목" name="title" className="outline-none w-full" />
                </div>
                <div className="border-gray-300 border-b p-2">
                    <div>
                        <FormControlLabel
                            value="allDay"
                            control={<Switch color="primary" defaultChecked />}
                            label="하루종일"
                            labelPlacement="start"
                            style={{ margin: "0px", display: "flex", justifyContent: "space-between" }}
                        />
                    </div>
                    <div className="flex justify-between my-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="시작일"
                                value={dayjs(selectedDate.startDate)}
                                onChange={() => {}}
                                className="z-50"
                                showDaysOutsideCurrentMonth
                                format="YYYY-MM-DD H:mm:A"
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="flex justify-between my-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="종료일"
                                value={dayjs(selectedDate.endDate)}
                                onChange={() => {}}
                                className="z-50"
                                showDaysOutsideCurrentMonth
                                format="YYYY-MM-DD H:mm:A"
                            />
                        </LocalizationProvider>
                    </div>
                </div>
            </div>
        </dialog>
        ,
        document.getElementById('modal')!
    )
}

export default TodoDialog;