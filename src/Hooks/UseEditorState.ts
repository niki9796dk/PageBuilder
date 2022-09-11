import {useMemo} from 'react';
import {useAppSelector} from '../Store/hooks';

export default function useEditorState<T, S>(editing: boolean, defaultValue: T, editorValue: (editorState: S) => T): T {
    const {editorState} = useAppSelector(state => state.editing);

    return  useMemo(() => {
        if (editing) {
            return editorValue(editorState);
        }

        return defaultValue;
    }, [editing, defaultValue, editorValue, editorState]);
}
