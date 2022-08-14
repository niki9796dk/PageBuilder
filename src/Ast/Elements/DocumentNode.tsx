import {AST} from "../types";
import {SectionNode} from "./SectionNode";
import {Validator} from "../Validator";
import StyleMap from "../StyleMap";
import './../Styles/reset.css'
import './../Styles/obsidian.css'
import './../Styles/style.css'
import React from "react";
import {AstNode} from "../../types";
import _ from "lodash";

interface DocumentNodeAst {
    type: string;
    version: string;
    sections: Array<any>;
    style: any;
}

type Sections = {
    [key: string]: SectionNode;
};

export default class DocumentNode extends React.Component<AstNode<DocumentNodeAst>, any> implements AST{
    public readonly style: StyleMap;
    public readonly sections: Sections = {};

    constructor(props: Readonly<AstNode<DocumentNodeAst>> | AstNode<DocumentNodeAst>) {
        super(props);

        // Validate the generic abstract syntax tree
        Validator.validate(props.ast);

        // Build typed abstract syntax tree with this document as the root
        this.style = new StyleMap(props.ast.style ?? {});
    }

    toJson(): object {
        return {
            type: this.props.ast.type,
            version: this.props.ast.version,
            sections: _.map(this.sections, (node: SectionNode) => node.toJson()),
            style: this.style.toJson(),
        };
    }

    render() {
        return <div
            className="node-document"
            style={this.style.getStyleMap()}
            children={this.renderSections()}
        />
    }

    private renderSections(): JSX.Element[] {
        return _.map(this.props.ast.sections, (section: any, key: string) => {
            return <SectionNode
                key={key}
                ast={section}
                editorMode={this.props.editorMode}
                ref={(element: SectionNode|null) => this.setSectionNode(element, key)}
            />
        })
    }

    private setSectionNode(element: SectionNode|null, key: string): void {
        if (element === null) {
            delete this.sections[key];
        } else {
            this.sections[key] = element;
        }
    }
}
