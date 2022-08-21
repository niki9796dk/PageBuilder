import {BlockNodeAst, BlockNodeProps} from "./PositionalBlock";
import StyleMap from "../../StyleMap";
import {useState} from "react";
import {PositionalBlock} from "./PositionalBlock";

interface LineNodeAst extends BlockNodeAst {
    color?: string
}

export default function CodeNode (props: BlockNodeProps<LineNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [color, setColor] = useState(props.ast.color);

    return (
        <PositionalBlock position={props.ast.position} zIndex={props.zIndex} gridSize={props.gridSize} editorMode={props.editorMode}>
            <div className="node-line" style={style.getStyleMap()}>
                <hr style={{backgroundColor: color ?? 'black'}}/>
            </div>
        </PositionalBlock>
    );
}
