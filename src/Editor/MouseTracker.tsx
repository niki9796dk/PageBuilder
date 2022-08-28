import React, {useEffect, useRef} from 'react';
import './Editor.css';

export interface TrackedPosition {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface Props {
    children: any;
    spawnEvent: React.MouseEvent;
    onMove?: (position : TrackedPosition) => void;
}

export default function MouseTracker(props: Props) {
    const follower = useRef<HTMLDivElement | null>(null);
    const wrapper = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Mount
        trackMouse(props.spawnEvent.nativeEvent);
        document.addEventListener('mousemove', trackMouse);
        document.addEventListener('dragover', trackMouse);

        // Unmount
        return () => {
            document.removeEventListener('mousemove', trackMouse);
            document.removeEventListener('dragover', trackMouse);
        };
    }, []);

    const trackMouse = (event : MouseEvent) => {
        if (follower.current === null || follower.current?.style === null) {
            return;
        }

        follower.current.style.left = event.pageX + 'px';
        follower.current.style.top = event.pageY + 'px';

        if (props.onMove && wrapper.current) {
            const offset = wrapper.current.children[0]?.getBoundingClientRect();

            props.onMove({
                top: offset.top + window.scrollY,
                left: offset.left + window.scrollX,
                height: wrapper.current.children[0]?.getBoundingClientRect()?.height ?? 0,
                width: wrapper.current.children[0]?.getBoundingClientRect()?.width ?? 0,
            });
        }
    };

    return (
        <div ref={follower} className="absolute cursor-move z-30 select-none touch-none">
            <div
                ref={wrapper}
                children={props.children}
            />
        </div>
    );
}
