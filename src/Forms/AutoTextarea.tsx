import React, {ChangeEvent, TextareaHTMLAttributes, useEffect, useRef} from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export default function AutoTextarea(props: TextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (!textareaRef || !textareaRef.current) {
            return;
        }

        textareaRef.current.style.height = '0px';
        const scrollHeight = textareaRef.current.scrollHeight + 2;
        textareaRef.current.style.height = scrollHeight + 'px';
    }, [props.value]);

    const handleOnChange = (event : ChangeEvent<HTMLTextAreaElement>) => {
        if (props.onChange) {
            props.onChange(event);
        }
    };

    return (
        <textarea
            {...props}
            ref={textareaRef}
            className={props.className + ' resize-none'}
            value={props.value}
            onChange={handleOnChange}
        />
    );
}
