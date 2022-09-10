import React, {ChangeEvent} from 'react';
import {QuoteNodeAst} from '../../Ast/Elements/Blocks/QuoteNode';
import {useAppDispatch} from '../../Store/hooks';
import {updateState} from '../../Store/Slices/EditingSlice';
import AutoTextarea from '../../Forms/AutoTextarea';

interface QuoteNodeEditorProps {
    editorState: QuoteNodeAst,
}

export default function QuoteNodeEditor(props: QuoteNodeEditorProps) {
    const dispatch = useAppDispatch();

    const handleChange = (state : Partial<QuoteNodeAst>) => {
        dispatch(updateState({
            ...props.editorState,
            ...state,
        }));
    };

    const handleQuoteChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        handleChange({quote: event.target.value});
    };

    const handleAuthorChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleChange({author: event.target.value});
    };

    return (
        <div>
            <div className="text-3xl text-center">
                <span className="border-b border-black border-solid px-5">Quote</span>
                <hr style={{marginTop: '-1px'}}/>
            </div>

            <div className="mt-5">
                <label>Author</label>
                <input type="text" className="w-full" defaultValue={props.editorState.author} onChange={handleAuthorChange}/>
            </div>

            <div className="mt-5">
                <label>Quote</label>
                <AutoTextarea rows={4} defaultValue={props.editorState.quote} onChange={handleQuoteChange}/>
            </div>
        </div>
    );
}
