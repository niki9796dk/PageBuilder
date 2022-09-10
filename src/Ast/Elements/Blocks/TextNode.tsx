import {useEffect, useRef, useState} from 'react';
import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import './TextNode.css';
import StyleMap from '../../StyleMap';
import {PositionalBlock} from './PositionalBlock';
import React from 'react';
import {v4 as uuidv4} from 'uuid';

export interface TextNodeAst extends BlockNodeAst {
    value: string;
}

export function TextNode(props: BlockNodeProps<TextNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [text, setText] = useState(props.ast.value);
    const [editing, setEditing] = useState(false);
    const textarea = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        setTimeout(() => textarea.current?.focus(), 50);
    }, [textarea, editing]);

    const handleEditStart = () => {
        setText(props.ast.value);
        setEditing(true);
    };

    const handleEditEnd = () => {
        setEditing(false);
        props.astUpdater({value: text}, true, true);
    };

    let content;

    if (editing) {
        content = <textarea
            ref={textarea}
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="node-text outline-none overflow-hidden all-inherit min-h-fit cursor-text"
            style={style.getStyleMap()}
        />;
    } else {
        content = (
            <p className="node-text whitespace-pre-wrap" style={style.getStyleMap()}>{props.ast.value}</p>
        );
    }

    return (
        <PositionalBlock {...props} onEditBegin={handleEditStart} onEditEnd={handleEditEnd} disableDragging={editing}>
            {content}
        </PositionalBlock>
    );
}

export function defaultTextNodeAst(): TextNodeAst {
    return {
        'id': uuidv4(),
        'type': 'block',
        'subType': 'text',
        'value': 'Inspire your audience',
        'position': {
            'height': 1,
            'width': 4,
            'left': 0,
            'top': 0
        }
    };
}
