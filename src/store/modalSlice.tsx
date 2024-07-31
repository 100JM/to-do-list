import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
    isOpen: boolean;
    isAddArea: boolean;
    isTodoButton: boolean;
    isUserDialog: boolean;
};

const initModalState: ModalState = {
    isOpen: false,
    isAddArea: false,
    isTodoButton: false,
    isUserDialog: false
};

const ModalSlice = createSlice({
    name: 'modal',
    initialState: initModalState,
    reducers: {
        handleModal: (state, action) => {
            state.isOpen = action.payload;
        },
        handleAddArea: (state, action) => {
            state.isAddArea = action.payload;
        },
        handleIsTodoButton: (state, action) => {
            state.isTodoButton = action.payload;
        },
        handleUserModal: (state, action) => {
            state.isUserDialog = action.payload;
        }
    },
});

export const modalAction = ModalSlice.actions;
export default ModalSlice.reducer;