import React, {useEffect, useRef} from 'react';
import './Collapsable.css';
import useLocalStorageStateToggle from '../../../../Hooks/UseLocalStorageStateToggle';

interface Properties {
    label: string,
    children: JSX.Element|JSX.Element[],
    startExpanded?: boolean,
    className?: string
    onChange?: (expanded: boolean) => void;
}

export default function Collapsable(props : Properties) {
    const content = useRef<HTMLDivElement|null>(null);
    const icon = useRef<HTMLElement|null>(null);
    const [expanded, toggleExpanded] = useLocalStorageStateToggle('collapsable-' + props.label, props.startExpanded ?? false);

    // Vertically aligns icon :shrug:
    useEffect(() => {
        if (! icon.current) {
            return;
        }

        const parentHeight = icon.current.parentElement?.scrollHeight;

        if (parentHeight) {
            icon.current.style.lineHeight = (parentHeight - 1) + 'px';
        }
    }, []);

    // Expands or collapses content
    useEffect(() => {
        if (! content.current) {
            return;
        }

        if (expanded){
            content.current.style.maxHeight = content.current.scrollHeight + 'px';
        } else {
            content.current.style.maxHeight = '0';
        }

        if (props.onChange) {
            props.onChange(expanded);
        }
    }, [expanded, props.children]);

    return (
        <div className={'collapsable ' + props.className ?? ''}>
            <div className="collapsable-label px-1 hover:bg-purple-weak text-xl" onClick={() => toggleExpanded()}>
                <span>{props.label}</span>
                <i ref={icon} className={`fa-solid float-right fa-${expanded ? 'minus' : 'plus'}`}/>
                <hr/>
            </div>
            <div ref={content} className="px-2 collapsable-content bg-purple-weak">
                <div className="py-2">
                    {props.children}
                </div>
            </div>
        </div>
    );
}
