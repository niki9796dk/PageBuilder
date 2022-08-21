import {BlockNodeAst, BlockNodeProps} from "./PositionalBlock";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import php from 'highlight.js/lib/languages/php';
import StyleMap from "../../StyleMap";
import {useState} from "react";
import {PositionalBlock} from "./PositionalBlock";

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('php', php);

interface CodeNodeAst extends BlockNodeAst{
    value: string;
}

export default function CodeNode (props: BlockNodeProps<CodeNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [code, setCode] = useState(props.ast.value);

    const getRenderedCode = () => {
        let renderedCode = hljs.highlightAuto(code).value;

        // TODO: Figure out how to do this the react way, instead of "dangerouslySetInnerHTML"
        return <code className="hljs" dangerouslySetInnerHTML={{__html: renderedCode}}/>;
    }

    return (
        <PositionalBlock position={props.ast.position} zIndex={props.zIndex} gridSize={props.gridSize} editorMode={props.editorMode}>
            <pre
                className="node-code"
                style={style.getStyleMap()}
                children={getRenderedCode()}
            />
        </PositionalBlock>
    );
}
