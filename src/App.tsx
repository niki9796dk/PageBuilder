import React, {useEffect, useState} from 'react';
import DocumentNode, {DocumentNodeAst} from './Ast/Elements/DocumentNode';
import {Validator} from './Ast/Validator';
import axios from 'axios';

export default function App() {
    const [ast, setAst] = useState<DocumentNodeAst | null>(null);

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
            return JSON.parse(savedAst);
        }

        const response = await axios.get('/ast-example-blocks.json');

        return response.data;
    };

    if (! ast) {
        return <div className="page">Loading...</div>;
    }

    return <DocumentNode ast={ast} editorMode={true} astUpdater={(ast: DocumentNodeAst) => updateAst({...ast})}></DocumentNode>;
}
