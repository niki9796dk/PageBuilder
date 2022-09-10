import {configureStore} from '@reduxjs/toolkit';
import sectionReducer from './Slices/SectionsSlice';
import editingReducer from './Slices/EditingSlice';

export const store = configureStore({
    reducer: {
        sections: sectionReducer,
        editing: editingReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
