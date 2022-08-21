import {BlockFactoryList} from './types';
import {assert} from './Assert';
import ImageNode from './Elements/Blocks/ImageNode';
import LineNode from './Elements/Blocks/LineNode';
import CodeNode from './Elements/Blocks/CodeNode';
import QuoteNode from './Elements/Blocks/QuoteNode';
import {TextNode} from './Elements/Blocks/TextNode';
import {GridSize} from './Elements/Blocks/PositionalBlock';
import React from 'react';

export class BlockFactory {
    static create(key: string, block: any, zIndex: number, editorMode: boolean, gridSize: GridSize): JSX.Element {
        const factories: BlockFactoryList = {
            text: TextNode,
            image: ImageNode,
            line: LineNode,
            code: CodeNode,
            quote: QuoteNode,
        };

        const BlockSubType = factories[block.subType];

        assert(BlockSubType !== undefined, `No block factory found for [${block.type}]`);

        return <BlockSubType
            key={key}
            ast={block}
            editorMode={editorMode}
            zIndex={zIndex}
            gridSize={gridSize}
        />;
    }
}
