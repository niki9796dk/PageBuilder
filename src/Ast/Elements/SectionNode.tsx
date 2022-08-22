import {BlockFactory} from '../BlockFactory';
import StyleMap from '../StyleMap';
import GridNode from '../ElementProperties/GridNode';
import React, {useEffect, useRef, useState} from 'react';
import {AstNode} from '../../types';
import _ from 'lodash';
import {BlockNodeAst} from './Blocks/PositionalBlock';
import './SectionNode.css';

export interface SectionNodeAst {
    type: string;
    style: any;
    blocks: Array<BlockNodeAst>;
    grid: any;
}

export function SectionNode(props: AstNode<SectionNodeAst>) {
    const grid = useRef<GridNode | null>(null);
    const style = new StyleMap(props.ast.style);
    const [sectionHeight, setSectionHeight] = useState(-1);

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

    const updateBlockAst = (key: number, updatedAst: any) => {
        props.ast.blocks[key] = updatedAst;
        setSectionHeight(getSectionHeight());

        props.astUpdater(props.ast);
    };

    const renderBlocks = () => {
        return _.map(props.ast.blocks, (block: any, key: number) => {
            return BlockFactory.create(
                key,
                block,
                1,
                props.editorMode,
                getGridSize(),
                updatedAst => updateBlockAst(key, updatedAst)
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
