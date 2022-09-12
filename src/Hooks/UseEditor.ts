import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../Store/hooks';
import {beginEdit, stopEdit} from '../Store/Slices/EditingSlice';
import {cloneDeep} from 'lodash';
import {BlockNodeAst, BlockNodeProps} from '../Ast/Elements/Blocks/PositionalBlock';

interface EditorHook<AST> {
    editing: boolean,
    ast: AST,
    block: {
        onEditBegin: () => void;
        onEditEnd: () => void;
    }
}

export default function useEditor<T extends BlockNodeAst>(blockNode: BlockNodeProps<T>): EditorHook<T> {
    const [editing, setEditing] = useState(false);
    const {editorState} = useAppSelector(state => state.editing);
    const dispatch = useAppDispatch();

    const handleEditBegin = () => {
        setEditing(true);

        dispatch(beginEdit({
            editorKey: blockNode.ast.subType,
            editorState: blockNode.ast,
        }));
    };

    const handleEditEnd = () => {
        if (! editing) {
            return;
        }

        const updatedState = cloneDeep(editorState);
        delete updatedState['position'];

        blockNode.astUpdater(updatedState, true, true);
        dispatch(stopEdit());
        setEditing(false);
    };

    return {
        editing: editing,
        ast: editing ? editorState : blockNode.ast,
        block: {
            onEditBegin: handleEditBegin,
            onEditEnd: handleEditEnd,
        }
    };
}
