import {BlockNode, BlockNodeAst} from "../BlockNode";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import php from 'highlight.js/lib/languages/php';

interface CodeNodeAst extends BlockNodeAst{
    value: string;
}

export default class CodeNode extends BlockNode<CodeNodeAst> {
    render(): JSX.Element {
        hljs.registerLanguage('javascript', javascript);
        hljs.registerLanguage('php', php);

        // TODO: Figure out how to do this the react way, instead of "dangerouslySetInnerHTML"
        let renderedCode = hljs.highlightAuto(this.props.ast.value).value;
        let code = <code className="hljs" dangerouslySetInnerHTML={{__html: renderedCode}}/>;

        return (
            <pre
                className="node-code"
                style={this.getStyleMap()}
                children={code}
            />
        );
    }

    toJson(): object {
        return {
            value: this.props.ast.value,
            ...super.toJson(),
        };
    }
}
