import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit';
import {cloneDeep} from 'lodash';

interface EditingState {
    id: null|string,
    editorKey: null|string,
    editorState: any,
}

export const EditingSlice = createSlice({
    name: 'sections',
    initialState: {
        id: null,
        editorKey: null,
        editorState: null,
    },
    reducers: {
        updateState: (state : Draft<EditingState>, action : PayloadAction<any>) => {
            state.editorState = cloneDeep(action.payload);
        },
        beginEdit: (state : Draft<EditingState>, action : PayloadAction<EditingState>) => {
            state.id = action.payload.id;
            state.editorKey = action.payload.editorKey;
            state.editorState = cloneDeep(action.payload.editorState);
        },
        stopEdit: (state : Draft<EditingState>) => {
            state.id = null;
            state.editorKey = null;
            state.editorState = {};
        },
    }
});

export const { beginEdit, stopEdit, updateState} = EditingSlice.actions;
export default EditingSlice.reducer;
