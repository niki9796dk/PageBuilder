import axios from 'axios';
import React, {useEffect, useState} from 'react';
import DocumentNode from './Ast/Elements/DocumentNode';
import {Validator} from './Ast/Validator';

export default function App() {
    const [ast, setAst] = useState<any | null>(null);

    useEffect(() => {
        if (! ast) {
            axios
                .get('/ast-example-blocks.json')
                .then((response) => {
                    const ast = response.data;

                    Validator.validate(ast);
                    setAst(ast);
                });
        }
    });

    if (! ast) {
        return <div className="page">Loading...</div>;
    }

    return <DocumentNode ast={ast} editorMode={true}></DocumentNode>;
}
