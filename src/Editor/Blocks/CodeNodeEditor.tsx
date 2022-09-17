import React from 'react';
import {useAppDispatch} from '../../Store/hooks';
import {updateState} from '../../Store/Slices/EditingSlice';
import AutoTextarea from '../../Forms/AutoTextarea';
import Collapsable from './Common/Structure/Collapsable';
import {CodeNodeAst} from '../../Ast/Elements/Blocks/CodeNode';
import EditorSelect from './Common/Inputs/EditorSelect';
import FontSizeInput from './Common/Inputs/FontSizeInput';

interface TextNodeEditorProps {
    editorState: CodeNodeAst,
}

export default function CodeNodeEditor(props: TextNodeEditorProps) {
    const dispatch = useAppDispatch();

    const handleChange = (state: Partial<CodeNodeAst>) => {
        dispatch(updateState({
            ...props.editorState,
            ...state,
        }));
    };

    return (
        <div>
            <div className="text-3xl text-center">
                <span className="border-b border-black border-solid px-5">Text</span>
                <hr style={{marginTop: '-1px'}}/>
            </div>

            <Collapsable label="Content" startExpanded={true} className="mt-5">
                <div>
                    <label>Language</label>
                    <EditorSelect
                        onChange={entry => entry && handleChange({language: entry.value})}
                        value={props.editorState.language}
                        options={[
                            {value: 'php', label: 'php'},
                            {value: 'javascript', label: 'javascript'},
                        ]}
                    />
                </div>
                <div className="mt-5">
                    <label>Code</label>
                    <AutoTextarea rows={4} value={props.editorState.value} onChange={event => handleChange({value: event.target.value})}/>
                </div>
            </Collapsable>

            <Collapsable label="Text Styling" startExpanded={true} className="mt-5">
                <div>
                    <label>Size</label>
                    <FontSizeInput value={(props.editorState.style ?? {})['font-size'] ?? '1rem'} onChange={(size) => handleChange({style: {...props.editorState.style ?? {}, 'font-size': size}})}/>
                </div>
            </Collapsable>
        </div>
    );
}
