import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import './TextNode.css';
import StyleMap from '../../StyleMap';
import {PositionalBlock} from './PositionalBlock';
import React from 'react';
import {v4 as uuidv4} from 'uuid';
import useEditor from '../../../Hooks/UseEditor';
import useEditorState from '../../../Hooks/UseEditorState';

export interface TextNodeAst extends BlockNodeAst {
    value: string;
}

export function TextNode(props: BlockNodeProps<TextNodeAst>) {
    const {editing, onEditBegin, onEditEnd} = useEditor(props);
    const text = useEditorState<string, TextNodeAst>(editing, props.ast.value, state => state.value);
    const style = useEditorState<StyleMap, TextNodeAst>(editing, new StyleMap(props.ast.style), state => new StyleMap(state.style));

    return (
        <PositionalBlock {...props} onEditBegin={onEditBegin} onEditEnd={onEditEnd}>
            <p className="node-text whitespace-pre-wrap" style={style.getStyleMap()}>{text}</p>
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
