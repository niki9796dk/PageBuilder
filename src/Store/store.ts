import {configureStore} from "@reduxjs/toolkit";
import sectionReducer from "./Slices/SectionsSlice";

export const store = configureStore({
    reducer: {
        sections: sectionReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
