import {BlockNode, BlockNodeAst} from "../BlockNode";

interface QuoteNodeAst extends BlockNodeAst {
    quote: string;
    author: string;
}

export default class QuoteNode extends BlockNode<QuoteNodeAst> {
    render(): JSX.Element {
        return (
            <figure className="node-quote" style={this.getStyleMap()}>
                <blockquote>{this.props.ast.quote}</blockquote>
                <figcaption style={{float: 'right'}}>
                    &mdash; <cite>{this.props.ast.author}</cite>
                </figcaption>
            </figure>
        );
    }

    toJson(): object {
        return {
            quote: this.props.ast.quote,
            author: this.props.ast.author,
            ...super.toJson(),
        };
    }
}
