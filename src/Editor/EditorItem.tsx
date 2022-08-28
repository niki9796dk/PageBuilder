import React from 'react';
import './Editor.css';
import {DocumentNodeAst} from '../Ast/Elements/DocumentNode';
import {defaultTextNodeAst} from '../Ast/Elements/Blocks/TextNode';
import {BlockNodeAst} from '../Ast/Elements/Blocks/PositionalBlock';
import {defaultImageNodeAst} from '../Ast/Elements/Blocks/ImageNode';
import {defaultQuoteNodeAst} from '../Ast/Elements/Blocks/QuoteNode';
import {defaultLineNodeAst} from '../Ast/Elements/Blocks/LineNode';
import {defaultCodeNodeAst} from '../Ast/Elements/Blocks/CodeNode';
import {defaultTextCarouselNodeAst} from '../Ast/Elements/Blocks/TextCarouselNode';

interface Props {
    children: any;
    onClick?: () => void;
}

export default function EditorItem(props: Props) {
    return (
        <div className="element-item" onClick={props.onClick}>
            <div className="content">
                {props.children}
            </div>
        </div>
    );
}
