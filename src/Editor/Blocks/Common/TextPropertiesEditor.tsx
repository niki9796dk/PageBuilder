import React, {useMemo} from 'react';
import FontSizeInput from './Inputs/FontSizeInput';
import ColorPickerInput from './Inputs/ColorPickerInput';

interface TextPropertiesProps {
    styles: any;
    handleChange: (styles: any) => void;
}

export default function TextPropertiesEditor(props: TextPropertiesProps) {
    const style = useMemo(() => props.styles ?? {},[props.styles]);

    return (
        <div>
            <div>
                <label>Size</label>
                <FontSizeInput value={style['font-size'] ?? '1rem'} onChange={(size) => props.handleChange({...props.styles, 'font-size': size})}/>
            </div>

            <div className="mt-5">
                <label>Color</label>
                <ColorPickerInput value={style['color'] ?? '#000000'} onChange={(color) => props.handleChange({...props.styles, 'color': color})}/>
            </div>
        </div>
    );
}
