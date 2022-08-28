import {BlockNodeAst, BlockNodeProps} from './PositionalBlock';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import php from 'highlight.js/lib/languages/php';
import StyleMap from '../../StyleMap';
import {useState} from 'react';
import {PositionalBlock} from './PositionalBlock';
import './CodeNode.css';
import React from 'react';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('php', php);

interface CodeNodeAst extends BlockNodeAst{
    value: string;
}

export default function CodeNode(props: BlockNodeProps<CodeNodeAst>) {
    const style = new StyleMap(props.ast.style ?? {});
    const [code] = useState(props.ast.value);

    const getRenderedCode = () => {
        const renderedCode = hljs.highlightAuto(code).value;

        // TODO: Figure out how to do this the react way, instead of "dangerouslySetInnerHTML"
        return <code className="hljs" dangerouslySetInnerHTML={{__html: renderedCode}}/>;
    };

    return (
        <PositionalBlock {...props}>
            <pre
                className="node-code"
                style={style.getStyleMap()}
                children={getRenderedCode()} /* @eslint */
            />
        </PositionalBlock>
    );
}

export function defaultCodeNodeAst(): CodeNodeAst {
    return {
        'type': 'block',
        'subType': 'code',
        'value': 'console.log(\'Hello World!\');',
        'position': {
            'height': 3,
            'width': 7,
            'left': 0,
            'top': 0
        }
    };
}
