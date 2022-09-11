import React from 'react';
import {QuoteNodeAst} from '../../Ast/Elements/Blocks/QuoteNode';
import {useAppDispatch} from '../../Store/hooks';
import {updateState} from '../../Store/Slices/EditingSlice';
import AutoTextarea from '../../Forms/AutoTextarea';
import TextPropertiesEditor from './Common/TextPropertiesEditor';
import Collapsable from './Common/Structure/Collapsable';
import {TextNodeAst} from '../../Ast/Elements/Blocks/TextNode';

interface QuoteNodeEditorProps {
    editorState: TextNodeAst,
}

export default function QuoteNodeEditor(props: QuoteNodeEditorProps) {
    const dispatch = useAppDispatch();

    const handleChange = (state: Partial<QuoteNodeAst>) => {
        dispatch(updateState({
            ...props.editorState,
            ...state,
        }));
    };

    const handleStyleChange = (style: any) => {
        handleChange({
            style: {
                ...props.editorState.style ?? {},
                ...style
            }
        });
    };

    return (
        <div>
            <div className="text-3xl text-center">
                <span className="border-b border-black border-solid px-5">Text</span>
                <hr style={{marginTop: '-1px'}}/>
            </div>

            <Collapsable label="Content" startExpanded={true} className="mt-5">
                <div className="mt-5">
                    <label>Text</label>
                    <AutoTextarea rows={4} value={props.editorState.value} onChange={event => handleChange({quote: event.target.value})}/>
                </div>
            </Collapsable>

            <Collapsable label="Text Styling" startExpanded={false} className="mt-5">
                <TextPropertiesEditor styles={props.editorState.style} handleChange={handleStyleChange}/>
            </Collapsable>
        </div>
    );
}
