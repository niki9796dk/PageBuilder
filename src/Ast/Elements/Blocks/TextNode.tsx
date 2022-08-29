import {useState} from 'react';
import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import './TextNode.css';
import StyleMap from '../../StyleMap';
import {PositionalBlock} from './PositionalBlock';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface TextNodeAst extends BlockNodeAst {
    value: string;
}

export function TextNode(props: BlockNodeProps<TextNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [text] = useState(props.ast.value);

    return (
        <PositionalBlock {...props}>
            <p
                className="node-text"
                style={style.getStyleMap()}
                // TODO: Figure out how to do this the "react way" instead of "dangerouslySetInnerHTML"
                dangerouslySetInnerHTML={{__html: text.replaceAll('\n', '<br>')}}
            />
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
