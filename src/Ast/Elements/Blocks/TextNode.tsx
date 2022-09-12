import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import './TextNode.css';
import StyleMap from '../../StyleMap';
import {PositionalBlock} from './PositionalBlock';
import React from 'react';
import {v4 as uuidv4} from 'uuid';
import useEditor from '../../../Hooks/UseEditor';

export interface TextNodeAst extends BlockNodeAst {
    value: string;
}

export function TextNode(props: BlockNodeProps<TextNodeAst>) {
    const {ast, block} = useEditor(props);
    const style = new StyleMap(ast.style);

    return (
        <PositionalBlock {...props} {...block}>
            <p className="node-text whitespace-pre-wrap" style={style.getStyleMap()}>{ast.value}</p>
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
