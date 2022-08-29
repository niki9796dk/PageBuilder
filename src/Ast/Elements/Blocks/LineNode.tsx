import React from 'react';
import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import {useState} from 'react';
import {PositionalBlock} from './PositionalBlock';
import './LineNode.css';
import {v4 as uuidv4} from 'uuid';

interface LineNodeAst extends BlockNodeAst {
    color?: string
}

export default function LineNode(props: BlockNodeProps<LineNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [color] = useState(props.ast.color);

    return (
        <PositionalBlock {...props}>
            <div className="node-line" style={style.getStyleMap()}>
                <hr style={{borderColor: color ?? 'black'}}/>
            </div>
        </PositionalBlock>
    );
}

export function defaultLineNodeAst(): LineNodeAst {
    return {
        'id': uuidv4(),
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
