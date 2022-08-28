import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import BlockPosition from './BlockPosition';
import {ReactElement, useEffect, useRef, useState} from 'react';
import './PositionalBlock.css';
import {DragState, SharedGestureState} from '@use-gesture/core/src/types/state';
import {ceil, clamp, round} from 'lodash';
import {AstNode} from '../../../types';
import React from 'react';

export interface Position {
    height: number;
    width: number;
    left: number;
    top: number;
}

export interface BlockNodeAst {
    type: string;
    subType: string;
    position: Position;
    style?: any;
}

export interface GridSize {
    cellWidth: number,
    cellHeight: number,
}

export interface BlockNodeProps<BlockSubTypeAst extends BlockNodeAst> extends AstNode<BlockSubTypeAst> {
    zIndex: number;
    gridSize: GridSize,
}

interface Props extends BlockNodeProps<any> {
    children: ReactElement;
}

export function PositionalBlock(props: Props) {
    const [{x, y, width, height}, api] = useSpring(() => ({ x: 0, y: 0, width: 0, height: 0}));
    const [moving, setMoving] = useState(false);
    const [resizing, setResizing] = useState(false);
    const preview = useRef<HTMLDivElement | null>(null);
    const childWrapper = useRef<HTMLDivElement | null>(null);
    const resizer = useRef<HTMLDivElement | null>(null);
    const block = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState(new BlockPosition(props.ast.position));
    const [previewPosition, setPreviewPosition] = useState(new BlockPosition(props.ast.position));

    useEffect(() => {
        props.ast.position = position;
        props.astUpdater(props.ast);

        // Make sure that the child element cannot be taller than the actual block
        if ((childWrapper.current?.clientHeight ?? 0) > (block.current?.clientHeight ?? 0)) {
            setPosition(new BlockPosition({...position, height: position.height + 1}));
        }
    }, [position]);

    const bind = useDrag(async (state) => {
        if (! props.editorMode) {
            return;
        }

        if (state.event.target == resizer.current) {
            handleResize(state);
        } else {
            handleMove(state);
        }
    }, {
        from: (event) => {
            if (event.target === resizer.current) {
                return [block?.current?.clientWidth ?? 0, block?.current?.clientHeight ?? 0];
            } else {
                return [0, 0];
            }
        }
    });

    const handleMove = (state: DragState&SharedGestureState) => {
        setMoving(state.dragging ?? true);

        api.set({
            x: state.offset[0],
            y: state.offset[1],
        });

        setPreviewPosition(() => calculateMovePosition(position));

        if (! state.dragging) {
            setPosition(calculateMovePosition(position));
        }
    };

    const handleResize = (state: DragState&SharedGestureState) => {
        setResizing(state.dragging ?? true);

        api.set({
            width: state.offset[0],
            height: state.offset[1],
        });

        const delta = [state.xy[0] - state.initial[0], state.xy[1] - state.initial[1]];

        setPreviewPosition(() => calculateResizePosition(position, delta));

        if (! state.dragging) {
            setPosition(calculateResizePosition(position, delta));
        }
    };

    const calculateMovePosition = (position: BlockPosition) => {
        if (! moving) {
            return position;
        }

        const moveX = round(x.get() / props.gridSize.cellWidth);
        const moveY = round(y.get() / props.gridSize.cellHeight);

        return new BlockPosition({
            ...position,
            left: clamp(position.left + moveX, 0, 24 - position.width),
            top: Math.max(0, position.top + moveY)
        });
    };

    const calculateResizePosition = (position: BlockPosition, delta : Array<number>) => {
        if (! resizing) {
            return position;
        }

        const moveX = round(delta[0] / props.gridSize.cellWidth);
        const moveY = round(delta[1] / props.gridSize.cellHeight);

        const contentHeight = ceil((childWrapper.current?.children[0]?.clientHeight ?? 0) / props.gridSize.cellHeight);

        return new BlockPosition({
            ...position,
            width: clamp(position.width + moveX, 2, 24 - position.left),
            height: Math.max(0, position.height + moveY, contentHeight),
        });
    };

    const styleThing = () => {
        if (resizing) {
            return {width, height};
        }

        if (moving) {
            return {x, y};
        }

        return {};
    };

    return (
        <>
            {props.editorMode &&
                <div
                    ref={preview}
                    className={`block-drag-preview ${resizing || moving ? '' : 'hidden'}`}
                    style={previewPosition.getStyleMap()}
                />
            }
            <animated.div
                ref={block}
                className={`
                    positional-block 
                    ${resizing || moving ? 'noSelect' : ''} 
                    ${props.editorMode ? 'editorMode' : ''}
                `}
                style={{
                    ...position.getStyleMap(),
                    zIndex: props.zIndex,
                    ...styleThing()
                }}
                {...bind()}
            >
                <div className="resizer" ref={resizer}/>
                <div ref={childWrapper} className="w-full h-full">
                    {props.children}
                </div>
            </animated.div>
        </>
    );
}

