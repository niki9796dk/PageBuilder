import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit';

export interface Section {
    index: number,
    left: number;
    top: number;
}

interface SectionsState {
    sections: {
        [keys: number] : Section
    },
}

export const SectionsSlice = createSlice({
    name: 'sections',
    initialState: {
        sections: {},
    } as SectionsState,
    reducers: {
        // Registers a section into the store.
        registerSection: (state : Draft<SectionsState>, action : PayloadAction<Section>) => {
            state.sections = {
                ...state.sections,
                [action.payload.index]: action.payload,
            };
        },
    }
});

export const { registerSection } = SectionsSlice.actions;
export default SectionsSlice.reducer;
