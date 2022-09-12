import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import {PositionalBlock} from './PositionalBlock';
import './QuoteNode.css';
import React from 'react';
import {v4 as uuidv4} from 'uuid';
import useEditor from '../../../Hooks/UseEditor';

export interface QuoteNodeAst extends BlockNodeAst {
    quote: string;
    author: string;
}

export default function QuoteNode(props: BlockNodeProps<QuoteNodeAst>) {
    const {ast, block} = useEditor(props);
    const style = new StyleMap(ast.style);

    return (
        <PositionalBlock {...props} {...block}>
            <figure className="node-quote" style={style.getStyleMap()}>
                <blockquote className="whitespace-pre-wrap">{ast.quote}</blockquote>
                <figcaption className="float-right">
                    &mdash; <cite className="whitespace-pre-wrap">{ast.author}</cite>
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
