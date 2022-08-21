import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import DocumentNode from './Ast/Elements/DocumentNode'

export default function App () {
    const [ast, setAst] = useState<any | null>(null);
    const documentNode = useRef<DocumentNode | null>(null);

    useEffect(() => {
        if (! ast) {
            axios
                .get('/ast-example-blocks.json')
                .then((response) => {
                    setAst(response.data)
                });
        }
    })

    if (! ast) {
        return <div className="page">Loading...</div>
    }

    return <DocumentNode ref={documentNode} ast={ast} editorMode={true}></DocumentNode>
}
