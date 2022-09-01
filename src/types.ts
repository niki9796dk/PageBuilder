interface AstNode<astType> {
    ast: astType;
    editorMode: boolean;
    astUpdater: (updatedAst: astType|null, saveChange: boolean) => void;
}

export type {AstNode};
