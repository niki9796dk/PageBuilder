import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import BlockPosition from './BlockPosition';
import {ReactElement, useCallback, useMemo, useRef, useState} from 'react';
import './PositionalBlock.css';
import {DragState, SharedGestureState} from '@use-gesture/core/src/types/state';
import {ceil, clamp, cloneDeep, round, throttle} from 'lodash';
import {AstNode} from '../../../types';
import React from 'react';
import {publish} from '../../../events';

export interface Position {
    height: number;
    width: number;
    left: number;
    top: number;
}

export interface BlockNodeAst {
    id: string;
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
    const quickEditor = useRef<HTMLDivElement | null>(null);
    const position = useMemo(() => new BlockPosition(props.ast.position), [props]);
    const [previewPosition, setPreviewPosition] = useState(new BlockPosition(props.ast.position));
    const onDragChange = useCallback(throttle(() => {
        if (! block.current) {
            return;
        }

        publish(block.current, 'blockMove', {});
    }, 50), [block]);

    const setPosition = (newPosition: BlockPosition, saveChange: boolean) => {
        const astClone = cloneDeep(props.ast);

        astClone.position = {...props.ast.position, ...newPosition.toJson()};
        props.astUpdater(astClone, saveChange);

        // Make sure that the child element cannot be taller than the actual block
        if ((childWrapper.current?.clientHeight ?? 0) > (block.current?.clientHeight ?? 0)) {
            setPosition(new BlockPosition({...newPosition, height: newPosition.height + 1}), false);
        }
    };

    const bind = useDrag(async (state) => {
        if (! props.editorMode || quickEditor.current?.contains(state.event.target as Element)) {
            return;
        }

        onDragChange();

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
            setPosition(calculateMovePosition(position), true);
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
            setPosition(calculateResizePosition(position, delta), true);
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

    const positionStyles = () => {
        if (resizing) {
            return {width, height};
        }

        if (moving) {
            return {x, y};
        }

        return {};
    };

    const handleDelete = () => {
        props.astUpdater(null, true);
    };

    const handleEdit = () => {
        console.log('Edit');
    };

    return (
        <>
            {props.editorMode && (resizing || moving) &&
                <div
                    ref={preview}
                    className="block-drag-preview"
                    style={previewPosition.getStyleMap()}
                />
            }
            <animated.div
                ref={block}
                className={`positional-block ${resizing || moving ? 'noSelect' : ''} ${props.editorMode ? 'editorMode group' : ''}`}
                style={{
                    ...position.getStyleMap(),
                    zIndex: props.zIndex,
                    ...positionStyles()
                }}
                {...bind()}
            >
                <div ref={quickEditor} className="hidden group-hover:block block-quick-settings absolute min-w-full cursor-default pt-3" style={{transform: 'translateY(calc(-100%))', paddingBottom: '1px'}}>
                    <div className="bg-background shadow-dynamic-stroke border-b-0 w-fit mx-auto px-1 rounded-t-lg whitespace-nowrap">
                        <i className="fa-solid fa-pencil px-3 cursor-pointer hover:text-blue-700" onClick={handleEdit}/>
                        <span className="w-1 border-r border-stroke cursor-default"/>
                        <i className="fa-solid fa-trash-can px-3 cursor-pointer hover:text-red-700" onClick={handleDelete}/>
                    </div>
                </div>
                <div className="resizer" ref={resizer}/>
                <div ref={childWrapper} className="w-full h-full">
                    {props.children}
                </div>
            </animated.div>
        </>
    );
}

