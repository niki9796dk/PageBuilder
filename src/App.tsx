import {AppProps, AppState} from "./types";
import axios from "axios";
import React from "react";
import DocumentNode from './Ast/Elements/DocumentNode'

export default class App extends React.Component<AppProps, AppState> {
    private documentNode: DocumentNode|null = null;

    state: AppState = {
        ast: false
    }

    constructor(props: AppProps, context: any) {
        super(props, context);
    }

    render() {
        if (! this.state.ast) {
            return <div className="page">Loading...</div>
        }

        return <DocumentNode ref={(el) => this.documentNode = el} ast={this.state.ast} editorMode={false}></DocumentNode>
    }

    componentDidMount() {
        axios
            .get('/ast.json')
            .then((response) => {
                this.setState({
                    ast: response.data,
                });
            });
    }
}
