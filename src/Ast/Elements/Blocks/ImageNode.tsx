import {BlockNodeAst, BlockNodeProps} from "./PositionalBlock";
import StyleMap from "../../StyleMap";
import {useState} from "react";
import {PositionalBlock} from "./PositionalBlock";

interface ImageNodeAst extends BlockNodeAst {
    src: string;
    alt?: string;
}

export default function ImageNode (props: BlockNodeProps<ImageNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [src, setSrc] = useState(props.ast.src);
    const [alt, setAlt] = useState(props.ast.alt);

    return (
        <PositionalBlock position={props.ast.position} zIndex={props.zIndex} gridSize={props.gridSize} editorMode={props.editorMode}>
            <img
                className="node-image"
                style={style.getStyleMap()}
                src={src}
                alt={alt}
            />
        </PositionalBlock>
    )
}
