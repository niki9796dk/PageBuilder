import React, {useEffect, useState} from 'react';
import DocumentNode, {DocumentNodeAst} from './Ast/Elements/DocumentNode';
import {Validator} from './Ast/Validator';
import axios from 'axios';
import './App.css';
import Editor from './Editor';

export default function App() {
    const [ast, setAst] = useState<DocumentNodeAst | null>(null);
    const [editorMode, setEditorMode] = useState(true);

    useEffect(() => {
        if (ast) {
            localStorage.setItem('saved_ast', JSON.stringify(ast));
        } else {
            fetchAst().then((ast: DocumentNodeAst) => updateAst(ast));
        }
    }, [ast]);

    const updateAst = (ast: DocumentNodeAst) => {
        Validator.validate(ast);
        setAst(ast);
    };

    const fetchAst = async () => {
        const savedAst = localStorage.getItem('saved_ast');

        if (savedAst !== null) {
            // return JSON.parse(savedAst); // TODO: enable again some day
        }

        const response = await axios.get('/ast-example-blocks.json');

        return response.data;
    };

    if (! ast) {
        return <div className="page">Loading...</div>;
    }

    return (
        <div style={{height: '100%'}}>

            {editorMode &&
                <Editor
                    ast={ast}
                    astUpdater={(ast: DocumentNodeAst) => updateAst({...ast})}
                    style={{width: '500px', float: 'left', height: '100%'}}
                />
            }

            <DocumentNode
                ast={ast}
                editorMode={editorMode}
                astUpdater={(ast: DocumentNodeAst) => updateAst({...ast})}
                style={{
                    width: editorMode ? 'calc(100% - 500px)' : '100%',
                    float: 'left',
                    height: '100%',
                }}
            />

            {/* TODO: Remove in the future - Only for development*/}
            <button
                style={{position: 'absolute', bottom: '1em', left: '1em', backgroundColor: editorMode ? 'lightblue' : 'gray', padding: '5px', borderRadius: '5px', cursor: 'pointer'}}
                onClick={() => setEditorMode(! editorMode)}
            >
                Editor Mode
            </button>
        </div>
    );
}
