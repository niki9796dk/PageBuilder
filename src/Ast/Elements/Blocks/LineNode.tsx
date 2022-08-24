import React from 'react';
import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import {useState} from 'react';
import {PositionalBlock} from './PositionalBlock';
import './LineNode.css';

interface LineNodeAst extends BlockNodeAst {
    color?: string
}

export default function LineNode(props: BlockNodeProps<LineNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [color] = useState(props.ast.color);

    return (
        <PositionalBlock {...props}>
            <div className="node-line" style={style.getStyleMap()}>
                <hr style={{backgroundColor: color ?? 'black'}}/>
            </div>
        </PositionalBlock>
    );
}

export function defaultLineNodeAst(): LineNodeAst {
    return {
        'type': 'block',
        'subType': 'line',
        'position': {
            'height': 2,
            'width': 4,
            'left': 0,
            'top': 0
        }
    };
}
