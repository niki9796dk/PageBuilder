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
import useKeyPress from './Hooks/UseKeyPress';
import {mergeObjects} from './helpers';

export default function App() {
    const [ast, setAst] = useState<DocumentNodeAst | null>(null);
    const [editorMode, setEditorMode] = useState(true);
    const editHistory = useRef<EditHistory | null>(null);
    const goBackKeyPress = useKeyPress({key: 'z', ctrl: true, shift: false});
    const goForwardKeyPress = useKeyPress([{key: 'z', ctrl: true, shift: true}, {key: 'y', ctrl: true}]);

    useEffect(() => {
        if (ast) {
            localStorage.setItem('saved_ast', JSON.stringify(ast));
        } else {
            fetchAst().then((ast: DocumentNodeAst) => {
                updateAst(ast, true, false);
                editHistory.current = new EditHistory(ast);
            });
        }
    }, [ast]);

    useEffect(() => {
        if (editHistory.current === null || ! editorMode) {
            return;
        }

        if (goBackKeyPress) {
            updateAst(editHistory.current?.goBack(), false, false);
        } else if (goForwardKeyPress) {
            updateAst(editHistory.current?.goForward(), false, false);
        }
    }, [goBackKeyPress, goForwardKeyPress, editorMode]);

    const updateAst = (ast: Partial<DocumentNodeAst> | null, saveChange: boolean, isPartial: boolean) => {
        assert(ast !== null, 'Root AST cannot be null');

        if (isPartial) {
            const clonedUpdate = cloneDeep(ast);
            const clonedCurrent = cloneDeep(editHistory.current?.getCurrent());

            if (clonedCurrent !== undefined) {
                ast = mergeObjects(clonedCurrent, clonedUpdate);
            }
        }

        // Do nothing if the given AST is equal to the current one
        if (saveChange && isEqual(ast, editHistory.current?.getCurrent())) {
            return;
        }

        // Deep clone to avoid passing references around to nested keys
        const cloneAst = cloneDeep(ast) as DocumentNodeAst;

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

            <DocumentNode
                ast={ast}
                editorMode={editorMode}
                astUpdater={(updatedAst, saveChange, isPartial) => updateAst(updatedAst, saveChange, isPartial)}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: editorMode ? '350px' : '0',
                    width: editorMode ? 'calc(100% - 350px)' : '100%',
                    height: '100%',
                }}
            />

            {editorMode &&
                <Editor
                    ast={ast}
                    astUpdater={(ast: DocumentNodeAst, isPartial) => updateAst({...ast}, true, isPartial)}
                />
            }

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
