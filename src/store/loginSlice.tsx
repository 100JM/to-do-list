import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
    isLogin:boolean,
    name:string,
    id:number,
    accessToken:string
};

interface handleLogin {
    name:string,
    id:number,
    accessToken:string
};

const initLoginState:LoginState = {
    isLogin: false,
    name: '',
    id: 0,
    accessToken: ''
};

const loginSlice = createSlice({
    name: 'login',
    initialState: initLoginState,
    reducers: {
        handleLogin: (state, action: PayloadAction<handleLogin>) => {
            state.isLogin = true;
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.accessToken = action.payload.accessToken;
        },
        handleLogout: (state) => {
            state.isLogin = false;
            state.id = 0;
            state.name = '';
            state.accessToken = '';
        },
    }
});

export const loginAction = loginSlice.actions;
export default loginSlice.reducer;