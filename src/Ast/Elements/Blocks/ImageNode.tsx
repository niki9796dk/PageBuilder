import {BlockNodeAst, BlockNodeProps, PositionalBlock} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import React, {useState} from 'react';

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
