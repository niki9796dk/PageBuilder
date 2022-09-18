import React from 'react';
import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import {PositionalBlock} from './PositionalBlock';
import './LineNode.css';
import {v4 as uuidv4} from 'uuid';
import useEditor from '../../../Hooks/UseEditor';

export interface LineNodeAst extends BlockNodeAst {
    color: string;
    height: number;
}

export default function LineNode(props: BlockNodeProps<LineNodeAst>) {
    const editor = useEditor(props);
    const style = new StyleMap(props.ast.style ?? {});

    return (
        <PositionalBlock {...props} {...editor}>
            <div className="node-line" style={style.getStyleMap()}>
                <hr style={{borderColor: props.ast.color, borderTopWidth: props.ast.height + 'px'}}/>
            </div>
        </PositionalBlock>
    );
}

export function defaultLineNodeAst(): LineNodeAst {
    return {
        'id': uuidv4(),
        'type': 'block',
        'subType': 'line',
        'color': '#000000',
        'height': 1,
        'position': {
            'height': 2,
            'width': 4,
            'left': 0,
            'top': 0
        }
    };
}
