import React from "react";
import {BlockNode, BlockNodeAst} from "../BlockNode";

interface TextNodeAst extends BlockNodeAst {
    value: string;
}

export default class TextNode extends BlockNode<TextNodeAst> {
    toJson(): object {
        return {
            value: this.props.ast.value,
            ...super.toJson(),
        };
    }

    render(): JSX.Element {
        // TODO: Figure out how to do this the "react way" instead of "dangerouslySetInnerHTML"
        let text = this.props.ast.value.replaceAll('\n', '<br>');

        return (
            <p
                className="node-text"
                style={this.getStyleMap()}
                dangerouslySetInnerHTML={{__html: text}}
            />
        );
    }
}
