interface AstNode<astType> {
    ast: astType;
    editorMode: boolean;
    astUpdater: (updatedAst: astType) => void;
}

export type {AstNode};
