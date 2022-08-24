import React from 'react';
import './Editor.css';
import {DocumentNodeAst} from './Ast/Elements/DocumentNode';
import {defaultTextNodeAst} from './Ast/Elements/Blocks/TextNode';
import {BlockNodeAst} from './Ast/Elements/Blocks/PositionalBlock';
import {defaultImageNodeAst} from './Ast/Elements/Blocks/ImageNode';
import {defaultQuoteNodeAst} from './Ast/Elements/Blocks/QuoteNode';
import {defaultLineNodeAst} from './Ast/Elements/Blocks/LineNode';
import {defaultCodeNodeAst} from './Ast/Elements/Blocks/CodeNode';
import {defaultTextCarouselNodeAst} from './Ast/Elements/Blocks/TextCarouselNode';

interface Props {
    style?: any,
    ast: DocumentNodeAst;
    astUpdater: (updatedAst: DocumentNodeAst) => void;
}

export default function Editor(props: Props) {
    const spawnBlock = (nodeSpawner : () => BlockNodeAst) => {
        // TODO: Figure out how to update other sections
        props.ast.sections[0].blocks.push(nodeSpawner());
        props.astUpdater(props.ast);
    };

    return (
        <div className="editor" style={props.style ?? {}}>
            <div className="element-group">
                <div className="element-group-title">Textual</div>
                <div className="element-group-items">
                    <div className="element-item" onClick={() => spawnBlock(defaultTextNodeAst)}>Text</div>
                    <div className="element-item" onClick={() => spawnBlock(defaultQuoteNodeAst)}>Quote</div>
                    <div className="element-item" onClick={() => spawnBlock(defaultCodeNodeAst)}>Code</div>
                    <div className="element-item" onClick={() => spawnBlock(defaultTextCarouselNodeAst)}>Text Carousel</div>
                </div>
            </div>

            <div className="element-group">
                <div className="element-group-title">Graphical</div>
                <div className="element-group-items">
                    <div className="element-item" onClick={() => spawnBlock(defaultImageNodeAst)}>Image</div>
                    <div className="element-item" onClick={() => spawnBlock(defaultLineNodeAst)}>Line</div>
                </div>
            </div>
        </div>
    );
}
