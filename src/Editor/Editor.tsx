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
import EditorItem from "./EditorItem";

interface Props {
    style?: any,
    ast: DocumentNodeAst;
    astUpdater: (updatedAst: DocumentNodeAst) => void;
}

export default function Editor(props: Props) {
    const spawnBlock = (nodeSpawner: () => BlockNodeAst) => {
        // TODO: Figure out how to update other sections
        props.ast.sections[0].blocks.push(nodeSpawner());
        props.astUpdater(props.ast);
    };

    return (
        <div className="editor" style={props.style ?? {}}>
            <div className="element-group">
                <div className="element-group-title">Textual</div>
                <div className="element-group-items">
                    <EditorItem onClick={() => spawnBlock(defaultTextNodeAst)}>
                        <i className="fa-solid fa-font icon"/>
                        <span className="icon-text">Text</span>
                    </EditorItem>
                    <EditorItem onClick={() => spawnBlock(defaultQuoteNodeAst)}>
                        <i className="fa-solid fa-quote-left icon"/>
                        <span className="icon-text">Quote</span>
                    </EditorItem>
                    <EditorItem onClick={() => spawnBlock(defaultCodeNodeAst)}>
                        <i className="fa-solid fa-code icon"/>
                        <span className="icon-text">Code</span>
                    </EditorItem>
                    <EditorItem onClick={() => spawnBlock(defaultTextCarouselNodeAst)}>
                        <i className="fa-regular fa-keyboard icon"/>
                        <span className="icon-text">Text Carousel</span>
                    </EditorItem>
                </div>
            </div>

            <div className="element-group">
                <div className="element-group-title">Graphical</div>
                <div className="element-group-items">
                    <EditorItem onClick={() => spawnBlock(defaultImageNodeAst)}>
                        <i className="fa-regular fa-image icon"/>
                        <span className="icon-text">Image</span>
                    </EditorItem>
                    <EditorItem onClick={() => spawnBlock(defaultLineNodeAst)}>
                        <i className="fa-regular fa-window-minimize icon" style={{position: 'relative', top: '-33%'}}/>
                        <span className="icon-text">Line</span>
                    </EditorItem>
                </div>
            </div>
        </div>
    );
}
