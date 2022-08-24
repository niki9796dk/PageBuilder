import {SectionNode, SectionNodeAst} from './SectionNode';
import StyleMap from '../StyleMap';
import './../Styles/reset.css';
import './../Styles/obsidian.css';
import React from 'react';
import {AstNode} from '../../types';
import _ from 'lodash';
import './DocumentNode.css';

export interface DocumentNodeAst {
    type: string;
    version: string;
    sections: Array<SectionNodeAst>;
    style: any;
}

interface Props extends AstNode<DocumentNodeAst>{
    style?: any;
}

export default function DocumentNode(props: Props) {
    const style = new StyleMap(props.ast.style);

    const updateSectionAst = (key: number, updatedAst: any) => {
        props.ast.sections[key] = updatedAst;

        props.astUpdater(props.ast);
    };

    const renderSections = () => {
        return _.map(props.ast.sections, (section: SectionNodeAst, key: number) => {
            return <SectionNode
                key={key}
                ast={section}
                editorMode={props.editorMode}
                astUpdater={(updatedAst) => updateSectionAst(key, updatedAst)}
            />;
        });
    };

    return (
        <div style={props.style ?? {}}>
            <div
                className="node-document"
                style={style.getStyleMap()}
                children={renderSections()}
            />
        </div>
    );
}
