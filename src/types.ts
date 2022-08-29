interface AstNode<astType> {
    ast: astType;
    editorMode: boolean;
    astUpdater: (updatedAst: astType|null) => void;
}

export type {AstNode};
