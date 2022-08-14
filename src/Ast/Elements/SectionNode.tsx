import {AST} from "../types";
import {BlockNode, BlockNodeAst} from "./BlockNode";
import {BlockFactory} from "../BlockFactory";
import StyleMap from "../StyleMap";
import GridNode from "../ElementProperties/GridNode";
import React from "react";
import {AstNode} from "../../types";
import _ from "lodash";

interface SectionNodeAst {
    type: string;
    style: any;
    blocks: Array<BlockNodeAst>;
    grid: any;
}

type Blocks = {
    [key: string]: BlockNode<any>;
};

export class SectionNode extends React.Component<AstNode<SectionNodeAst>, any> implements AST {
    public readonly blocks: Blocks = {};
    public grid: GridNode|null = null
    public readonly style: StyleMap;

    constructor(props: Readonly<AstNode<SectionNodeAst>> | AstNode<SectionNodeAst>) {
        super(props);

        this.style = new StyleMap(props.ast.style ?? {});
    }

    private getSectionHeight(): number {
        return Math.max(..._.map(
            this.props.ast.blocks,
            (blockNode) => blockNode.position.top + blockNode.position.height + 1),
        );
    }

    toJson(): object {
        return {
            type: this.props.ast.type,
            blocks: _.map(this.blocks, (blockNode) => blockNode.toJson()),
            style: this.style.toJson(),
            grid: this.props.ast.grid,
        };
    }

    render() {
        return <div className="node-section" style={this.style.getStyleMap()}>
            <GridNode
                ast={this.props.ast.grid}
                editorMode={this.props.editorMode}
                gridHeight={this.getSectionHeight()}
                children={this.renderBlocks()}
                ref={(grid) => this.grid = grid}
            />
        </div>
    }

    private renderBlocks(): JSX.Element[] {
        return _.map(this.props.ast.blocks, (block: any, key: string) => {
            return BlockFactory.create(
                key,
                block,
                1,
                this.props.editorMode,
                (element) => this.setBlockNode(element, key),
            );
        })
    }

    private setBlockNode(element: BlockNode<any> | null, key: string): void {
        if (element === null) {
            delete this.blocks[key];
        } else {
            this.blocks[key] = element;
        }
    }
}
