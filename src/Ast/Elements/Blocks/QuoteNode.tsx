import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import {useState} from 'react';
import {PositionalBlock} from './PositionalBlock';
import './QuoteNode.css';
import React from 'react';

interface QuoteNodeAst extends BlockNodeAst {
    quote: string;
    author: string;
}

export default function QuoteNode(props: BlockNodeProps<QuoteNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [quote] = useState(props.ast.quote);
    const [author] = useState(props.ast.author);

    return (
        <PositionalBlock {...props}>
            <figure className="node-quote" style={style.getStyleMap()}>
                <blockquote>{quote}</blockquote>
                <figcaption style={{float: 'right'}}>
                    &mdash; <cite>{author}</cite>
                </figcaption>
            </figure>
        </PositionalBlock>
    );
}
