import React from 'react';
import {useAppDispatch} from '../../Store/hooks';
import {updateState} from '../../Store/Slices/EditingSlice';
import AutoTextarea from '../../Forms/AutoTextarea';
import Collapsable from './Common/Structure/Collapsable';
import {TextCarouselNodeAst} from '../../Ast/Elements/Blocks/TextCarouselNode';
import FontSizeInput from './Common/Inputs/FontSizeInput';
import ColorPickerInput from './Common/Inputs/ColorPickerInput';

interface TextCarouselEditorProps {
    editorState: TextCarouselNodeAst,
}

export default function TextCarouselNodeEditor(props: TextCarouselEditorProps) {
    const dispatch = useAppDispatch();

    const handleChange = (state: Partial<TextCarouselNodeAst>) => {
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

    const handleDynamicTextChange = (text : string) => {
        handleChange({dynamicText: text.split('\n')});
    };

    return (
        <div>
            <div className="text-3xl text-center">
                <span className="border-b border-black border-solid px-5">Text</span>
                <hr style={{marginTop: '-1px'}}/>
            </div>

            <Collapsable label="Content" startExpanded={true} className="mt-5">
                <div>
                    <label>Static Text</label>
                    <AutoTextarea rows={4} value={props.editorState.staticText} onChange={event => handleChange({staticText: event.target.value})}/>
                </div>

                <div className="mt-5">
                    <label>Dynamic Text</label>
                    <AutoTextarea rows={4} value={props.editorState.dynamicText.join('\n')} onChange={event => handleDynamicTextChange(event.target.value)}/>
                </div>
            </Collapsable>

            <Collapsable label="Text Styling" startExpanded={false} className="mt-5">
                <div>
                    <label>Size</label>
                    <FontSizeInput value={(props.editorState.style ?? {})['font-size'] ?? '1rem'} onChange={(size) => handleStyleChange({'font-size': size})}/>
                </div>

                <div className="mt-5">
                    <label>Static Text Color</label>
                    <ColorPickerInput value={props.editorState.staticColor} onChange={(color) => handleChange({staticColor: color})}/>
                </div>

                <div className="mt-5">
                    <label>Dynamic Text Color</label>
                    <ColorPickerInput value={props.editorState.dynamicColor} onChange={(color) => handleChange({dynamicColor: color})}/>
                </div>
            </Collapsable>
        </div>
    );
}
