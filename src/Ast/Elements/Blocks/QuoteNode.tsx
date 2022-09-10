import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import {useState} from 'react';
import {PositionalBlock} from './PositionalBlock';
import './QuoteNode.css';
import React from 'react';
import {v4 as uuidv4} from 'uuid';

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

export function defaultQuoteNodeAst(): QuoteNodeAst {
    return {
        'id': uuidv4(),
        'type': 'block',
        'subType': 'quote',
        'quote': 'We cannot solve our problems with the same thinking we used when we created them.',
        'author': 'Albert Einstein',
        'position': {
            'height': 4,
            'width': 10,
            'left': 0,
            'top': 0
        }
    };
}
