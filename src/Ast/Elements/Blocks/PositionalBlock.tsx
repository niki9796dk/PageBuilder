import {animated, useSpring} from '@react-spring/web';
import {useDrag} from '@use-gesture/react';
import BlockPosition from './BlockPosition';
import {ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './PositionalBlock.css';
import {DragState, SharedGestureState} from '@use-gesture/core/src/types/state';
import {ceil, clamp, cloneDeep, round, throttle} from 'lodash';
import {AstNode} from '../../../types';
import React from 'react';
import {publish, subscribe, unsubscribe} from '../../../events';

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
    disableDragging?: boolean
    onEditBegin?: () => void;
    onEditEnd?: () => void;
}

interface Props extends BlockNodeProps<any> {
    children: ReactElement;
}

export function PositionalBlock(props: Props) {
    const [{x, y, width, height}, api] = useSpring(() => ({x: 0, y: 0, width: 0, height: 0}));
    const [moving, setMoving] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [editing, setEditing] = useState(false);
    const preview = useRef<HTMLDivElement | null>(null);
    const childWrapper = useRef<HTMLDivElement | null>(null);
    const resizer = useRef<HTMLDivElement | null>(null);
    const block = useRef<HTMLDivElement | null>(null);
    const quickEditor = useRef<HTMLDivElement | null>(null);
    const position = useMemo(() => new BlockPosition(props.ast.position), [props]);
    const [previewPosition, setPreviewPosition] = useState(new BlockPosition(props.ast.position));
    const onDragChange = useCallback(throttle(() => {
        if (!block.current) {
            return;
        }

        publish(block.current, 'blockMove', {});
    }, 50), [block]);

    const setPosition = (newPosition: BlockPosition, saveChange: boolean) => {
        const astClone = cloneDeep(props.ast);

        astClone.position = {...props.ast.position, ...newPosition.toJson()};
        props.astUpdater(
            {position: newPosition.toJson()},
            saveChange,
            true,
        );
    };

    useEffect(() => autoScaleHeight(), [props.ast.position]);

    const autoScaleHeight = () => {
        if (childWrapper.current === null) {
            return;
        }

        const timeout = setTimeout(() => {
            // Make sure that the child element cannot be taller than the actual block
            const contentHeight = ceil((childWrapper.current?.children[0]?.clientHeight ?? 0) / props.gridSize.cellHeight);

            if (props.ast.position.height < contentHeight) {
                setPosition(new BlockPosition({...props.ast.position, height: contentHeight}), false);
            }
        }, 25);

        return () => clearTimeout(timeout);
    };

    const bind = useDrag(async (state) => {
        if (!props.editorMode || quickEditor.current?.contains(state.event.target as Element)) {
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
        },
        keys: false,
        enabled: props.editorMode,
    });

    const handleMove = (state: DragState & SharedGestureState) => {
        // If disabled, then do nothing
        if (props.disableDragging) {
            setMoving(false);
            return;
        }

        // If we haven't previously considered us to have begun moving yet,
        // and our offset is 0 pixels, then we have only clicked the mouse and not yet begun the dragging.
        if (! moving && state.offset[0] == 0 && state.offset[1] == 0) {
            return;
        }

        setMoving(state.dragging ?? true);

        api.set({
            x: state.offset[0],
            y: state.offset[1],
        });

        setPreviewPosition(() => calculateMovePosition(position));

        if (!state.dragging) {
            setPosition(calculateMovePosition(position), true);
        }
    };

    const handleResize = (state: DragState & SharedGestureState) => {
        setResizing(state.dragging ?? true);

        api.set({
            width: state.offset[0],
            height: state.offset[1],
        });

        const delta = [state.xy[0] - state.initial[0], state.xy[1] - state.initial[1]];

        setPreviewPosition(() => calculateResizePosition(position, delta));

        if (!state.dragging) {
            setPosition(calculateResizePosition(position, delta), true);
        }
    };

    const calculateMovePosition = (position: BlockPosition) => {
        if (!moving) {
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

    const calculateResizePosition = (position: BlockPosition, delta: Array<number>) => {
        if (!resizing) {
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
        props.astUpdater(null, true, false);
    };

    const handleEdit = () => {
        setEditing(true);
    };

    useEffect(() => {
        if (editing && props.onEditBegin) {
            props.onEditBegin();
        } else if (!editing && props.onEditEnd) {
            props.onEditEnd();

            return autoScaleHeight();
        }
    }, [editing]);

    useEffect(() => {
        if (!editing) {
            return;
        }

        const mouseHandler = (event: Event) => {
            if (!editing || (event.target && block.current?.contains(event.target as Node))) {
                return;
            }

            setEditing(false);
        };

        subscribe(document.documentElement, 'click', mouseHandler);

        return () => {
            unsubscribe(document.documentElement, 'click', mouseHandler);
        };
    }, [editing]);

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
                className={`positional-block ${resizing || moving ? 'noSelect' : ''} ${props.editorMode ? 'editorMode group' : ''} ${editing ? 'editing' : ''} ${props.disableDragging ? '' : 'moveable'}`}
                onDoubleClick={() => setEditing(props.editorMode)}
                style={{
                    ...position.getStyleMap(),
                    zIndex: props.zIndex,
                    ...positionStyles()
                }}
                {...bind()}
            >
                <div ref={quickEditor}
                    className={`${editing ? 'block' : 'hidden group-hover:block'}  block-quick-settings absolute min-w-full cursor-default pt-3`}
                    style={{transform: 'translateY(calc(-100%))', paddingBottom: '1px'}}>
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

