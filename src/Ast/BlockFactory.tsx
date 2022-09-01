import {BlockFactoryList} from './types';
import {assert} from './Assert';
import ImageNode from './Elements/Blocks/ImageNode';
import LineNode from './Elements/Blocks/LineNode';
import CodeNode from './Elements/Blocks/CodeNode';
import QuoteNode from './Elements/Blocks/QuoteNode';
import {TextNode} from './Elements/Blocks/TextNode';
import {GridSize} from './Elements/Blocks/PositionalBlock';
import React from 'react';
import TextCarouselNode from './Elements/Blocks/TextCarouselNode';

export class BlockFactory {
    static create(block: any, zIndex: number, editorMode: boolean, gridSize: GridSize, astUpdater: (updatedAst: any, saveChange: boolean) => void): JSX.Element {
        const factories: BlockFactoryList = {
            text: TextNode,
            textCarousel: TextCarouselNode,
            image: ImageNode,
            line: LineNode,
            code: CodeNode,
            quote: QuoteNode,
        };

        const BlockSubType = factories[block.subType];

        assert(BlockSubType !== undefined, `No block factory found for [${block.type}]`);

        return <BlockSubType
            key={block.id}
            ast={block}
            editorMode={editorMode}
            zIndex={zIndex}
            gridSize={gridSize}
            astUpdater={astUpdater}
        />;
    }
}
