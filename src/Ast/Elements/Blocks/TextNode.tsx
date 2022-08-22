import {useState} from 'react';
import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import './TextNode.css';
import StyleMap from '../../StyleMap';
import {PositionalBlock} from './PositionalBlock';
import React from 'react';

interface TextNodeAst extends BlockNodeAst {
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
