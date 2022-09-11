import React, {ChangeEvent, useMemo, useRef} from 'react';
import useDisableWheel from '../../../../Hooks/UseDisableWheel';

interface TextPropertiesProps {
    onChange: (size: string) => void;
    value: string;
}

export default function FontSizeInput(props: TextPropertiesProps) {
    const input = useRef<HTMLInputElement | null>(null);
    const sizeNumber = useMemo(() => Number.parseFloat(props.value.replaceAll('rem', '')) * 10, [props.value]);
    useDisableWheel(input);

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newSize = (Number.parseFloat(event.target.value) / 10) + 'rem';

        props.onChange(newSize);
    };

    return (
        <input
            ref={input}
            min={5}
            type="number"
            className="w-full"
            value={sizeNumber}
            onChange={handleOnChange}
        />
    );
}
