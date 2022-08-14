import {BlockNode, BlockNodeAst} from "../BlockNode";

interface LineNodeAst extends BlockNodeAst {
    color?: string
}

export default class LineNode extends BlockNode<LineNodeAst> {
    render(): JSX.Element {
        return (
            <div className="node-line" style={this.getStyleMap()}>
                <hr/>
            </div>
        );
    }

    protected getStyleMap(): any {
        return {
            ...super.getStyleMap(),
            borderColor: this.props.ast.color ?? 'black',
        }
    }

    toJson(): object {
        return {
            color: this.props.ast.color,
            ...super.toJson(),
        };
    }
}
