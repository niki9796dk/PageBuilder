import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import StyleMap from '../../StyleMap';
import {PositionalBlock} from './PositionalBlock';
import './QuoteNode.css';
import React from 'react';
import {v4 as uuidv4} from 'uuid';
import useEditorState from '../../../Hooks/UseEditorState';
import useEditor from '../../../Hooks/UseEditor';

export interface QuoteNodeAst extends BlockNodeAst {
    quote: string;
    author: string;
}

export default function QuoteNode(props: BlockNodeProps<QuoteNodeAst>) {
    const {editing, onEditBegin, onEditEnd} = useEditor(props);
    const quote = useEditorState<string, QuoteNodeAst>(editing, props.ast.quote, state => state.quote);
    const author = useEditorState<string, QuoteNodeAst>(editing, props.ast.author, state => state.author);
    const style = useEditorState<StyleMap, QuoteNodeAst>(editing, new StyleMap(props.ast.style), state => new StyleMap(state.style));

    return (
        <PositionalBlock {...props} onEditBegin={onEditBegin} onEditEnd={onEditEnd}>
            <figure className="node-quote" style={style.getStyleMap()}>
                <blockquote className="whitespace-pre-wrap">{quote}</blockquote>
                <figcaption className="float-right">
                    &mdash; <cite className="whitespace-pre-wrap">{author}</cite>
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
