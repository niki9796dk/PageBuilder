import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit';
import {cloneDeep} from 'lodash';

interface EditingState {
    editorKey: null|string,
    editorState: any,
}

export const EditingSlice = createSlice({
    name: 'sections',
    initialState: {
        editorKey: null,
        editorState: null,
    } as EditingState,
    reducers: {
        updateState: (state : Draft<EditingState>, action : PayloadAction<any>) => {
            state.editorState = cloneDeep(action.payload);
        },
        beginEdit: (state : Draft<EditingState>, action : PayloadAction<EditingState>) => {
            state.editorKey = action.payload.editorKey;
            state.editorState = cloneDeep(action.payload.editorState);
        },
        stopEdit: (state : Draft<EditingState>) => {
            state.editorKey = null;
            state.editorState = {};
        },
    }
});

export const { beginEdit, stopEdit, updateState} = EditingSlice.actions;
export default EditingSlice.reducer;
