interface AstNode<astType> {
    ast: astType;
    editorMode: boolean;
    astUpdater: (updatedAst: Partial<astType>|null, saveChange: boolean, isPartial: boolean) => void;
}

export type {AstNode};
