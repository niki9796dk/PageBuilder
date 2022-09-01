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
import {cloneDeep, isEqual} from 'lodash';

export default function App() {
    const [ast, setAst] = useState<DocumentNodeAst | null>(null);
    const [editorMode, setEditorMode] = useState(true);
    const editHistory = useRef<EditHistory | null>(null);
    const goBackBinding = useKeyPress(event => event.key.toLowerCase() == 'z' && event.ctrlKey && !event.shiftKey);
    const goForwardBinding = useKeyPress(event => (event.key.toLowerCase() == 'z' && event.ctrlKey && event.shiftKey) || (event.key.toLowerCase() == 'y' && event.ctrlKey));

    useEffect(() => {
        if (ast) {
            localStorage.setItem('saved_ast', JSON.stringify(ast));
        } else {
            fetchAst().then((ast: DocumentNodeAst) => {
                updateAst(ast, true);
                editHistory.current = new EditHistory(ast);
            });
        }
    }, [ast]);

    useEffect(() => {
        if (editHistory.current === null) {
            return;
        }

        if (goBackBinding) {
            updateAst(editHistory.current?.goBack(), false);
        } else if (goForwardBinding) {
            updateAst(editHistory.current?.goForward(), false);
        }
    }, [goBackBinding, goForwardBinding]);

    const updateAst = (ast: DocumentNodeAst | null, saveChange: boolean) => {
        assert(ast !== null, 'Root AST cannot be null');

        // Do nothing if the given AST is equal to the current one
        if (saveChange && isEqual(ast, editHistory.current?.getCurrent())) {
            return;
        }

        // Deep clone to avoid passing references around to nested keys
        const cloneAst = cloneDeep(ast);

        Validator.validate(cloneAst);
        setAst(cloneAst);

        if (saveChange) {
            editHistory.current?.pushChange(cloneAst);
        }
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
                    astUpdater={(ast: DocumentNodeAst) => updateAst({...ast}, true)}
                    className="fixed top-0 left-0 h-screen"
                    style={{width: '350px'}}
                />
            }

            <DocumentNode
                ast={ast}
                editorMode={editorMode}
                astUpdater={(updatedAst, saveChange) => updateAst(updatedAst, saveChange)}
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

function useKeyPress(condition: (event: KeyboardEvent) => boolean) {
    const [targetKeysIsPressed, setTargetKeysIsPressed] = useState<number>(0);

    useEffect(() => {
        // Mount
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // Unmount
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleKeyDown = (event: KeyboardEvent) => {
        setTargetKeysIsPressed(prevState => {
            if (condition(event)) {
                return prevState + 1;
            }

            return 0;
        });
    };

    const handleKeyUp = () => {
        setTargetKeysIsPressed(0);
    };

    return targetKeysIsPressed;
}
