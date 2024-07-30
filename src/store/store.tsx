import { configureStore } from "@reduxjs/toolkit";

import modalReducer from "./modalSlice";
import dateReducer from "./dateSlice";
import loginReducer from "./loginSlice";

const store = configureStore({
    reducer: {
        modal: modalReducer,
        date: dateReducer,
        login: loginReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;