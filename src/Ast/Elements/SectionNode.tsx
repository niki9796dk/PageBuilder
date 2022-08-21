import {BlockFactory} from '../BlockFactory';
import StyleMap from '../StyleMap';
import GridNode from '../ElementProperties/GridNode';
import React, {useRef} from 'react';
import {AstNode} from '../../types';
import _ from 'lodash';
import {BlockNodeAst} from './Blocks/PositionalBlock';
import './SectionNode.css';

interface SectionNodeAst {
    type: string;
    style: any;
    blocks: Array<BlockNodeAst>;
    grid: any;
}

export function SectionNode (props: AstNode<SectionNodeAst>) {
    const grid = useRef<GridNode | null>(null);
    const style = new StyleMap(props.ast.style);

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

    const renderBlocks = () => {
        return _.map(props.ast.blocks, (block: any, key: string) => {
            return BlockFactory.create(
                key,
                block,
                1,
                props.editorMode,
                getGridSize(),
            );
        });
    };

    return <div className="node-section" style={style.getStyleMap()}>
        <GridNode
            ast={props.ast.grid}
            editorMode={props.editorMode}
            gridHeight={getSectionHeight()}
            children={renderBlocks()}
            ref={grid}
        />
    </div>;
}
