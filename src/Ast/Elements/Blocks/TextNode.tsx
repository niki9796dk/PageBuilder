import {useState} from 'react';
import {BlockNodeAst, BlockNodeProps} from "./PositionalBlock";
import './TextNode.css';
import StyleMap from "../../StyleMap";
import {PositionalBlock} from "./PositionalBlock";

interface TextNodeAst extends BlockNodeAst {
    value: string;
}

export function TextNode (props: BlockNodeProps<TextNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [text, setText] = useState(props.ast.value);

    return (
        <PositionalBlock position={props.ast.position} zIndex={props.zIndex} gridSize={props.gridSize} editorMode={props.editorMode}>
            <p
                className="node-text"
                style={style.getStyleMap()}
                // TODO: Figure out how to do this the "react way" instead of "dangerouslySetInnerHTML"
                dangerouslySetInnerHTML={{__html: text.replaceAll('\n', '<br>')}}
            />
        </PositionalBlock>
    );
}
