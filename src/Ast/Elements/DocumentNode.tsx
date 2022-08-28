import {SectionNode, SectionNodeAst} from './SectionNode';
import StyleMap from '../StyleMap';
import './../Styles/obsidian.css';
import React from 'react';
import {AstNode} from '../../types';
import _ from 'lodash';
import './DocumentNode.css';
import {useAppDispatch} from '../../Store/hooks';
import {registerSection} from '../../Store/Slices/SectionsSlice';

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
    const dispatch = useAppDispatch();

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
                onGridMove={(position) => dispatch(registerSection({index: key, ...position}))}
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
