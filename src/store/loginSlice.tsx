import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
    isLogin:boolean;
    name:string;
    id:number;
    profileImage:string;
    isLoading:boolean;
};

interface handleLogin {
    name:string;
    id:number;
    profileImage:string;
};

const initLoginState:LoginState = {
    isLogin: false,
    name: '',
    id: 0,
    profileImage: '',
    isLoading: true,
};

const loginSlice = createSlice({
    name: 'login',
    initialState: initLoginState,
    reducers: {
        handleLogin: (state, action: PayloadAction<handleLogin>) => {
            state.isLogin = true;
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.profileImage = action.payload.profileImage;
        },
        handleLogout: (state) => {
            state.isLogin = false;
            state.id = 0;
            state.name = '';
            state.profileImage = '';
        },
        handleLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    }
});

export const loginAction = loginSlice.actions;
export default loginSlice.reducer;