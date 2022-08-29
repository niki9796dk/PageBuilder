import {BlockNodeAst, BlockNodeProps, PositionalBlock} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import React, {useState} from 'react';
import './ImageNode.css';
import {v4 as uuidv4} from 'uuid';

interface ImageNodeAst extends BlockNodeAst {
    src: string;
    alt?: string;
}

export default function ImageNode(props: BlockNodeProps<ImageNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [src] = useState(props.ast.src);
    const [alt] = useState(props.ast.alt);

    return (
        <PositionalBlock {...props}>
            <img
                className="node-image"
                style={style.getStyleMap()}
                src={src}
                alt={alt}
            />
        </PositionalBlock>
    );
}

export function defaultImageNodeAst(): ImageNodeAst {
    return {
        'id': uuidv4(),
        'type': 'block',
        'subType': 'image',
        'src': '/DefaultImage.jpg',
        'alt': '',
        'position': {
            'height': 9,
            'width': 8,
            'left': 0,
            'top': 0
        }
    };
}
