import React, {ChangeEvent, useEffect, useRef} from 'react';

interface TextPropertiesProps {
    onChange: (color: string) => void;
    value: string | undefined;
}

export default function ColorPickerInput(props: TextPropertiesProps) {
    const wrapper = useRef<HTMLDivElement|null>(null);

    useEffect(() => {
        if (wrapper.current) {
            wrapper.current.style.backgroundColor = props.value ?? 'black';
        }
    }, [props]);

    const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
        const color = event.target.value;

        props.onChange(color);
    };

    return (
        <div ref={wrapper} className="color-picker rounded-2xl w-full bg-black">
            <input
                type="color"
                className="cursor-pointer w-full h-6 opacity-0 border-0 outline-0"
                value={props.value}
                onChange={handleChange}
            />
        </div>
    );
}
