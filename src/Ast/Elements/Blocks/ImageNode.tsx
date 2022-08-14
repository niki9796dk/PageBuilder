import {BlockNode, BlockNodeAst} from "../BlockNode";

interface ImageNodeAst extends BlockNodeAst {
    src: string;
    alt?: string;
}

export default class ImageNode extends BlockNode<ImageNodeAst>  {
    render(): JSX.Element {
        return (
            <img
                className="node-image"
                style={this.getStyleMap()}
                src={this.props.ast.src}
                alt={this.props.ast.alt ?? ''}
            />
        )
    }

    toJson(): object {
        return {
            src: this.props.ast.src,
            alt: this.props.ast.alt,
            ...super.toJson(),
        };
    }
}
