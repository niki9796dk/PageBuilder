import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import BlockPosition from "../BlockPosition";
import {GridSize} from "../BlockNode";
import {useEffect, useRef, useState} from "react";
import './PositionalBlock.css';
import {DragState} from "@use-gesture/core/src/types/state";
import {clamp, round} from "lodash";

interface props {
    zIndex: number,
    position: {
        height: number;
        width: number;
        left: number;
        top: number;
    };
    gridSize: GridSize,
    children: any;
    editorMode: boolean;
}

export function PositionalBlock (props: props) {
    const [{x, y}, api] = useSpring(() => ({ x: 0, y: 0}));
    const [dragging, setDragging] = useState(false);
    const preview = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState(new BlockPosition(props.position));
    const [previewPosition, setPreviewPosition] = useState(new BlockPosition(props.position));

    const bind = useDrag(async (state) => {
        if (! props.editorMode) {
            return;
        }

        setDragging(state.dragging ?? true);
        handleDrag(state);

        if (! state.dragging) {
            handleDragDone(state);
        }
    }, {
        from: () => {
            // I have absolutely no idea why...
            // But if the "from" state is exactly equal to [0, 0],
            // then the animated transform will not reset to a "none" state upon end of dragging.
            // Therefor a very small number is chosen, since it is not visible by the user and fixes the problem :shrug:
            return [1e-10, 1e-10]
        }
    });

    const handleDrag = (state: DragState) => {
        api.set({
            x: state.offset[0],
            y: state.offset[1],
        });

        setPreviewPosition(() => calculateDragPosition(position));
    };

    const handleDragDone = (state: DragState) => {
        setPosition(calculateDragPosition(position));

        api.set({x: 0, y: 0});
    };

    const calculateDragPosition = (position: BlockPosition) => {
        if (! dragging) {
            return position;
        }

        const moveX = round(x.get() / props.gridSize.cellWidth);
        const moveY = round(y.get() / props.gridSize.cellHeight);

        return new BlockPosition({
            ...position,
            top: Math.max(0, position.top + moveY),
            left: clamp(position.left + moveX, 0, 24 - position.width)
        });
    }

    return (
        <>
            {props.editorMode &&
                <div
                    ref={preview}
                    className={`block-drag-preview ${dragging ? '' : 'hidden'}`}
                    style={previewPosition.getStyleMap()}
                />
            }
            <animated.div
                className={`
                    positional-block 
                    ${dragging ? 'noSelect' : ''} 
                    ${props.editorMode ? 'editorMode' : ''}
                `}
                style={{
                    ...position.getStyleMap(),
                    zIndex: props.zIndex,
                    ...{x, y},
                }}
                {...bind()}
            >
                {props.children}
            </animated.div>
        </>
    );
}

