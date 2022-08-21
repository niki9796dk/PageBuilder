import GridGap from './GridGap';
import {AST} from '../types';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import {AstNode} from '../../types';
import GridPattern from './GridPattern';

interface GridNodeAst {
    type: string;
    gap: any;
}

interface GridNodeProps extends AstNode<GridNodeAst> {
    gridHeight: number;
    children: JSX.Element[]
}

export default class GridNode extends React.Component<GridNodeProps, any> implements AST {
    public readonly id: string;
    public gap: GridGap;

    constructor(props: GridNodeProps, context: any) {
        super(props, context);

        this.gap = new GridGap(props.ast.gap);
        this.id = uuidv4();
    }

    public toJson(): object {
        return {
            type: this.props.ast.type,
            gap: this.gap.toJson(),
        };
    }

    render(): JSX.Element {
        return (
            <div style={this.gap.getStyleMap()}>
                <GridPattern gap={this.gap} editorMode={this.props.editorMode} gridHeight={this.props.gridHeight}/>
                {this.props.children}
            </div>
        );
    }
}
