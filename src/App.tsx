import React, {useEffect, useRef, useState} from 'react';
import DocumentNode, {DocumentNodeAst} from './Ast/Elements/DocumentNode';
import {Validator} from './Ast/Validator';
import axios from 'axios';
import './App.css';
import Editor from './Editor/Editor';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import '@fortawesome/fontawesome-free/css/regular.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/v4-shims.min.css';
import {assert} from './Ast/Assert';
import EditHistory from './EditHistory';

export default function App() {
    const [ast, setAst] = useState<DocumentNodeAst | null>(null);
    const [editorMode, setEditorMode] = useState(true);
    const editHistory = useRef<EditHistory|null>(null);

    useEffect(() => {
        if (ast) {
            localStorage.setItem('saved_ast', JSON.stringify(ast));
        } else {
            fetchAst().then((ast: DocumentNodeAst) => {
                updateAst(ast);
                editHistory.current = new EditHistory(ast);
            });
        }
    }, [ast]);

    const updateAst = (ast: DocumentNodeAst|null) => {
        assert(ast !== null, 'Root AST cannot be null');

        Validator.validate(ast);
        setAst({...ast});
        editHistory.current?.pushChange(ast);
    };

    const fetchAst = async () => {
        const savedAst = localStorage.getItem('saved_ast');

        if (savedAst !== null) {
            // return JSON.parse(savedAst); // TODO: enable again some day
        }

        const response = await axios.get('/ast-example-blocks.json');

        return response.data;
    };

    if (!ast) {
        return <div className="page">Loading...</div>;
    }

    return (
        <div className="h-full">

            {editorMode &&
                <Editor
                    ast={ast}
                    astUpdater={(ast: DocumentNodeAst) => updateAst({...ast})}
                    className="fixed top-0 left-0 h-screen"
                    style={{width: '350px'}}
                />
            }

            <DocumentNode
                ast={ast}
                editorMode={editorMode}
                astUpdater={(ast) => updateAst(ast)}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: editorMode ? '350px' : '0',
                    width: editorMode ? 'calc(100% - 350px)' : '100%',
                    height: '100%',
                }}
            />

            {/* TODO: Remove in the future - Only for development*/}
            <button
                style={{
                    position: 'fixed',
                    bottom: '1em',
                    left: '1em',
                    backgroundColor: editorMode ? 'lightblue' : 'gray',
                    padding: '5px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={() => setEditorMode(!editorMode)}
            >
                Editor Mode
            </button>
        </div>
    );
}
