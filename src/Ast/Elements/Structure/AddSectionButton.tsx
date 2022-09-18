import React from 'react';

interface Props {
    editorMode: boolean;
    position: 'top'|'center';
    onClick: () => void;
}

export default function AddSectionButton(props: Props) {
    const handleClick = () => {
        if (props.editorMode) {
            props.onClick();
        }
    };

    return (
        <div className={`absolute w-full h-8 ${props.editorMode ? 'block' : 'hidden'}`}>
            <div className="relative group h-8" style={{top: props.position == 'center' ? '-50%' : ''}}>
                <i className="text-black hover:text-purple active:text-black fa-solid fa-square-plus text-3xl hidden group-hover:block cursor-pointer w-fit mx-auto" onClick={handleClick}/>
            </div>
        </div>
    );
}
