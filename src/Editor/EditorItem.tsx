import React, {MouseEventHandler} from 'react';
import './Editor.css';

interface Props {
    children: any;
    onMouseDown?: MouseEventHandler;
}

export default function EditorItem(props: Props) {
    return (
        <div className="element-item" onMouseDown={props.onMouseDown}>
            <div className="content">
                {props.children}
            </div>
        </div>
    );
}
