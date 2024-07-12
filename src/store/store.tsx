import { configureStore } from "@reduxjs/toolkit";

import modalReducer from "./modalSlice";
import dateReducer from "./dateSlice";

const store = configureStore({
    reducer: {
        modal: modalReducer,
        date: dateReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;