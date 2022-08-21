import {AST} from "../types";
import BlockPosition from "./BlockPosition";
import * as _ from "lodash";
import StyleMap from "../StyleMap";
import React, {ReactNode} from "react";
import {AstNode} from "../../types";

interface BlockNodeAst {
    type: string;
    subType: string;
    position: {
        height: number;
        width: number;
        left: number;
        top: number;
    };
    style: any;
}

export interface GridSize {
    cellWidth: number,
    cellHeight: number,
}

interface BlockNodeProps<BlockSubTypeAst extends BlockNodeAst> extends AstNode<BlockSubTypeAst> {
    zIndex: number;
    gridSize: GridSize,
}

abstract class BlockNode<NodeAst extends BlockNodeAst> extends React.Component<BlockNodeProps<NodeAst>, any> implements AST {
    public readonly position: BlockPosition;
    public readonly style: StyleMap;

    public constructor(props: BlockNodeProps<NodeAst>, context: any) {
        super(props, context);

        this.position = new BlockPosition(props.ast.position);
        this.style = new StyleMap(props.ast.style ?? {});
    }

    protected getStyleMap(): any {
        return {
            ...this.style.getStyleMap(),
            ...this.position.getStyleMap(),
            zIndex: this.props.zIndex,
        };
    }

    abstract render(): JSX.Element;

    public toJson(): object {
        return {
            type: this.props.ast.type,
            subType: this.props.ast.subType,
            position: this.position.toJson(),
            style: this.style.toJson(),
        };
    }
}

export type {BlockNodeAst, BlockNodeProps}
export {BlockNode}
