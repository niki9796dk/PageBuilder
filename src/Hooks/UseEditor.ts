import {useEffect, useState} from 'react';
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
    const {id, editorState} = useAppSelector(state => state.editing);
    const dispatch = useAppDispatch();

    const handleEditBegin = () => {
        if (editing) {
            return true;
        }

        dispatch(beginEdit({
            id: blockNode.ast.id,
            editorKey: blockNode.ast.subType,
            editorState: blockNode.ast,
        }));
        setEditing(true);
    };

    const handleEditEnd = () => {
        if (! editing) {
            return;
        }

        const clone: Partial<T> = cloneDeep(blockNode.ast);
        delete clone['position'];

        blockNode.astUpdater(clone, true, true);
        setEditing(false);

        if (id === blockNode.ast.id) {
            dispatch(stopEdit());
        }
    };

    useEffect(() => {
        if (!editing || id !== blockNode.ast.id || editorState === null) {
            return;
        }

        const updatedState = cloneDeep(editorState);
        delete updatedState['position'];

        blockNode.astUpdater(updatedState, false, true);
    }, [editing, id, editorState]);

    return {
        editing: editing,
        ast: (editing && editorState) ? editorState : blockNode.ast,
        block: {
            onEditBegin: handleEditBegin,
            onEditEnd: handleEditEnd,
        }
    };
}
