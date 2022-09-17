import React from 'react';
import {DocumentNodeAst} from '../Ast/Elements/DocumentNode';
import BlockEditor from './Blocks/BlockEditor';
import {useAppSelector} from '../Store/hooks';
import QuoteNodeEditor from './Blocks/QuoteNodeEditor';
import TextNodeEditor from './Blocks/TextNodeEditor';
import CodeNodeEditor from './Blocks/CodeNodeEditor';
import TextCarouselNodeEditor from './Blocks/TextCarouselNodeEditor';

interface Props {
    ast: DocumentNodeAst;
    astUpdater: (updatedAst: DocumentNodeAst, isPartial: boolean) => void;
}

export default function Editor(props: Props) {
    const state = useAppSelector(state => state.editing);

    const editorMap: {[key: string]: (props: any) => JSX.Element} = {
        'quote': QuoteNodeEditor,
        'text': TextNodeEditor,
        'code': CodeNodeEditor,
        'textCarousel': TextCarouselNodeEditor,
    };

    const EditorBlock = editorMap[state.editorKey ?? ''] ?? BlockEditor;

    return (
        <div id="editor" className="fixed top-0 left-0 h-screen" style={{width: '350px'}}>
            <EditorBlock {...props} {...state}/>
        </div>
    );
}
