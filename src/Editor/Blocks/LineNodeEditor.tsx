import React from 'react';
import {useAppDispatch} from '../../Store/hooks';
import {updateState} from '../../Store/Slices/EditingSlice';
import Collapsable from './Common/Structure/Collapsable';
import {LineNodeAst} from '../../Ast/Elements/Blocks/LineNode';
import ColorPickerInput from './Common/Inputs/ColorPickerInput';

interface LineNodeEditorProps {
    editorState: LineNodeAst,
}

export default function LineNodeEditor(props: LineNodeEditorProps) {
    const dispatch = useAppDispatch();

    const handleChange = (state: Partial<LineNodeAst>) => {
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

            <Collapsable label="Style" startExpanded={true} className="mt-5">
                <div>
                    <label>Size</label>
                    <input type="number" min={1} className="w-full" value={props.editorState.height} onChange={event => handleChange({height: Number.parseInt(event.target.value ?? 1)})}/>
                </div>

                <div className="mt-5">
                    <label>Color</label>
                    <ColorPickerInput value={props.editorState.color ?? '#000000'} onChange={(color) => handleChange({'color': color})}/>
                </div>
            </Collapsable>
        </div>
    );
}
