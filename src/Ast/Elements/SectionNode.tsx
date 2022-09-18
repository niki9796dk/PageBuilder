import {BlockFactory} from '../BlockFactory';
import StyleMap from '../StyleMap';
import GridNode, {GridNodeAst} from '../ElementProperties/GridNode';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {AstNode} from '../../types';
import _, {map, round} from 'lodash';
import {BlockNodeAst} from './Blocks/PositionalBlock';
import './SectionNode.css';
import {getDocumentOffset, mergeObjects, Offset} from '../../helpers';
import {subscribe, unsubscribe} from '../../events';
import {v4 as uuidv4} from 'uuid';

export interface SectionNodeAst {
    id: string;
    type: string;
    style: any;
    blocks: Array<BlockNodeAst>;
    grid: GridNodeAst;
}

interface Props extends AstNode<SectionNodeAst>{
    onGridMove?: (position : Offset) => void;
    onDestruct?: () => void;
}

export function SectionNode(props: Props) {
    const grid = createRef<HTMLDivElement>();
    const sectionDiv = useRef<HTMLDivElement | null>(null);
    const style = new StyleMap(props.ast.style);
    const [sectionHeight, setSectionHeight] = useState(-1);

    useEffect(() => {
        // Always trigger the onGridMove on mount or changes to the grid
        triggerOnGridMove();

        // Then afterward on every window resize event
        window.addEventListener('resize', triggerOnGridMove);

        return () => window.removeEventListener('resize', triggerOnGridMove);
    }, [grid]);

    useEffect(() => {
        // Update section height on every rerender, while in editor mode
        if (props.editorMode) {
            setSectionHeight(getSectionHeight(false));
        }
    }, [props.ast.blocks]);

    useEffect(() => {
        if (! grid.current) {
            return;
        }

        const gridNode = grid.current;

        subscribe(gridNode, 'blockMove', handleBlockMove);

        return () => unsubscribe(gridNode, 'blockMove', handleBlockMove);
    }, [grid]);

    const handleBlockMove = () => {
        setSectionHeight(getSectionHeight(true));
    };

    const triggerOnGridMove = () => {
        if (grid.current === null || props.onGridMove === undefined) {
            return;
        }

        // Trigger the callback
        props.onGridMove(getDocumentOffset(grid.current));
    };

    const getSectionHeight = (useBlockRendersAsReference : boolean) => {
        const astMaxGridY = Math.max(...map(
            props.ast.blocks,
            (blockNode) => blockNode.position.top + blockNode.position.height + 1),
        );

        if (! useBlockRendersAsReference || grid.current === null) {
            return astMaxGridY;
        }

        const renderedBlocksMaxGridY = getRenderedBlocksMaxGridY(grid.current);

        return Math.max(astMaxGridY, renderedBlocksMaxGridY);
    };

    const getRenderedBlocksMaxGridY = (grid : Element) => {
        const gridOffset = getDocumentOffset(grid);
        const children = grid.children;
        let max = 1;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const childOffset = getDocumentOffset(child);
            const childYGridHeight = round((childOffset.bottom - gridOffset.top) / 25);

            if (! child.classList.contains('positional-block')) {
                continue;
            }

            if (max < childYGridHeight) {
                max = childYGridHeight;
            }
        }

        // Plus one, since "end" is offset by one
        return max + 1;
    };

    const getGridSize = () => {
        return {
            cellWidth: 1200 / 24,
            cellHeight: 25,
        };
    };

    const updateBlockAst = (key: number, updatedAst: any, saveChange: boolean, isPartial: boolean) => {
        if (updatedAst === null) {
            props.ast.blocks.splice(key, 1);
        } else {
            if (isPartial) {
                updatedAst = mergeObjects(props.ast.blocks[key], updatedAst);
            }

            props.ast.blocks[key] = updatedAst;
        }

        props.astUpdater(props.ast, saveChange, isPartial);
    };

    const renderBlocks = () => {
        return _.map(props.ast.blocks, (block, key: number) => {
            return BlockFactory.create(
                block,
                1,
                props.editorMode,
                getGridSize(),
                (updatedAst, saveChange, isPartial) => updateBlockAst(key, updatedAst, saveChange, isPartial)
            );
        });
    };

    return <div ref={sectionDiv} className="node-section" style={style.getStyleMap()}>
        <GridNode
            ast={props.ast.grid}
            editorMode={props.editorMode}
            gridHeight={sectionHeight}
            children={renderBlocks()}
            ref={grid}
            astUpdater={() => {}} // eslint-disable-line
        />
    </div>;
}

export function defaultSectionNodeAst(): SectionNodeAst {
    return {
        id: uuidv4(),
        type: 'section',
        grid: {
            type: 'gridSettings',
            gap: {
                type: 'gridSettings',
                subType: 'gap',
                column: 0,
                row: 0
            }
        },
        blocks: [],
        style: {}
    };
}
