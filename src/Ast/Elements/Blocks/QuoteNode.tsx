import {BlockNodeAst, BlockNodeProps} from "../BlockNode";
import StyleMap from "../../StyleMap";
import {useState} from "react";
import {PositionalBlock} from "./PositionalBlock";

interface QuoteNodeAst extends BlockNodeAst {
    quote: string;
    author: string;
}

export default function QuoteNode (props: BlockNodeProps<QuoteNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [quote, setQuote] = useState(props.ast.quote);
    const [author, setAuthor] = useState(props.ast.author);

    return (
        <PositionalBlock position={props.ast.position} zIndex={props.zIndex} gridSize={props.gridSize} editorMode={props.editorMode}>
            <figure className="node-quote" style={style.getStyleMap()}>
                <blockquote>{quote}</blockquote>
                <figcaption style={{float: 'right'}}>
                    &mdash; <cite>{author}</cite>
                </figcaption>
            </figure>
        </PositionalBlock>
    );
}
