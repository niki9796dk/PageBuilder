import {BlockFactory} from '../BlockFactory';
import StyleMap from '../StyleMap';
import GridNode, {GridNodeAst} from '../ElementProperties/GridNode';
import React, {createRef, useEffect, useState} from 'react';
import {AstNode} from '../../types';
import _ from 'lodash';
import {BlockNodeAst} from './Blocks/PositionalBlock';
import './SectionNode.css';
import {getOffset, Offset} from '../../helpers';

export interface SectionNodeAst {
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
    const style = new StyleMap(props.ast.style);
    const [sectionHeight, setSectionHeight] = useState(-1);

    useEffect(() => {
        // Always trigger the onGridMove on mount or changes to the grid
        triggerOnGridMove();

        // Then afterward on every window resize event
        window.addEventListener('resize', triggerOnGridMove);

        return () => window.removeEventListener('resize', triggerOnGridMove);
    }, [grid]);

    const triggerOnGridMove = () => {
        if (grid.current === null || props.onGridMove === undefined) {
            return;
        }

        // Trigger the callback
        props.onGridMove(getOffset(grid.current));
    };

    useEffect(() => {
        if (sectionHeight == -1) {
            setSectionHeight(getSectionHeight());
        }
    }, [sectionHeight]);

    const getSectionHeight = () => {
        return Math.max(..._.map(
            props.ast.blocks,
            (blockNode) => blockNode.position.top + blockNode.position.height + 1),
        );
    };

    const getGridSize = () => {
        return {
            cellWidth: 1200 / 24,
            cellHeight: 25,
        };
    };

    const updateBlockAst = (key: number, updatedAst: any, saveChange: boolean) => {
        if (updatedAst === null) {
            props.ast.blocks.splice(key, 1);
        } else {
            props.ast.blocks[key] = updatedAst;
        }

        setSectionHeight(getSectionHeight());
        props.astUpdater(props.ast, saveChange);
    };

    const renderBlocks = () => {
        return _.map(props.ast.blocks, (block, key: number) => {
            return BlockFactory.create(
                block,
                1,
                props.editorMode,
                getGridSize(),
                (updatedAst, saveChange) => updateBlockAst(key, updatedAst, saveChange)
            );
        });
    };

    return <div className="node-section" style={style.getStyleMap()}>
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
