interface AppProps {
    name: string,
}

interface AppState {
    ast?: any,
}

interface AstNode<astType> {
    ast: astType;
    editorMode: boolean;
}

export type {AppProps, AppState, AstNode};
