import React from 'react';
import {useAppDispatch} from '../../Store/hooks';
import {updateState} from '../../Store/Slices/EditingSlice';
import AutoTextarea from '../../Forms/AutoTextarea';
import TextPropertiesEditor from './Common/TextPropertiesEditor';
import Collapsable from './Common/Structure/Collapsable';
import {TextNodeAst} from '../../Ast/Elements/Blocks/TextNode';

interface TextNodeEditorProps {
    editorState: TextNodeAst,
}

export default function TextNodeEditor(props: TextNodeEditorProps) {
    const dispatch = useAppDispatch();

    const handleChange = (state: Partial<TextNodeAst>) => {
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
                <div>
                    <label>Text</label>
                    <AutoTextarea rows={4} value={props.editorState.value} onChange={event => handleChange({value: event.target.value})}/>
                </div>
            </Collapsable>

            <Collapsable label="Text Styling" startExpanded={false} className="mt-5">
                <TextPropertiesEditor styles={props.editorState.style} handleChange={handleStyleChange}/>
            </Collapsable>
        </div>
    );
}
