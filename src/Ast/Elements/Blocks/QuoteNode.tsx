import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import {PositionalBlock} from './PositionalBlock';
import './QuoteNode.css';
import React, {useMemo, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {useAppDispatch, useAppSelector} from '../../../Store/hooks';
import {beginEdit, stopEdit} from '../../../Store/Slices/EditingSlice';
import {cloneDeep} from 'lodash';

export interface QuoteNodeAst extends BlockNodeAst {
    quote: string;
    author: string;
}

export default function QuoteNode(props: BlockNodeProps<QuoteNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [editing, setEditing] = useState(false);
    const {editorState} = useAppSelector(state => state.editing);
    const dispatch = useAppDispatch();
    const quote = useMemo(() => editing ? editorState.quote : props.ast.quote, [props.ast.quote, editing, editorState]);
    const author = useMemo(() => editing ? editorState.author : props.ast.author, [props.ast.author, editing, editorState]);

    const handleEditBegin = () => {
        setEditing(true);

        dispatch(beginEdit({
            editorKey: 'quote',
            editorState: props.ast,
        }));
    };

    const handleEditEnd = () => {
        if (! editing) {
            return;
        }

        const updatedState = cloneDeep(editorState);
        delete updatedState['position'];

        props.astUpdater(updatedState, true, true);
        dispatch(stopEdit());
        setEditing(false);
    };

    return (
        <PositionalBlock {...props} onEditBegin={handleEditBegin} onEditEnd={handleEditEnd}>
            <figure className="node-quote" style={style.getStyleMap()}>
                <blockquote className="whitespace-pre-wrap">{quote}</blockquote>
                <figcaption className="float-right">
                    &mdash; <cite className="whitespace-pre-wrap">{author}</cite>
                </figcaption>
            </figure>
        </PositionalBlock>
    );
}

export function defaultQuoteNodeAst(): QuoteNodeAst {
    return {
        'id': uuidv4(),
        'type': 'block',
        'subType': 'quote',
        'quote': 'We cannot solve our problems with the same thinking we used when we created them.',
        'author': 'Albert Einstein',
        'position': {
            'height': 4,
            'width': 10,
            'left': 0,
            'top': 0
        }
    };
}
