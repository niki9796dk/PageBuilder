import {SectionNode, SectionNodeAst} from './SectionNode';
import StyleMap from '../StyleMap';
import './../Styles/reset.css';
import './../Styles/obsidian.css';
import React from 'react';
import {AstNode} from '../../types';
import _ from 'lodash';
import './DocumentNode.css';

interface DocumentNodeAst {
    type: string;
    version: string;
    sections: Array<SectionNodeAst>;
    style: any;
}

export default function DocumentNode(props: AstNode<DocumentNodeAst>) {
    const style = new StyleMap(props.ast.style);

    const renderSections = () => {
        return _.map(props.ast.sections, (section: SectionNodeAst, key: string) => {
            return <SectionNode
                key={key}
                ast={section}
                editorMode={props.editorMode}
            />;
        });
    };

    return <div
        className="node-document"
        style={style.getStyleMap()}
        children={renderSections()}
    />;
}
